import { useEffect, useState } from "react";
import { collection, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../AuthContext";

import BackButton from "../components/buttons/BackButton";
import Submit from "../components/buttons/Buttons";
import ExpenseTypeSelector from "../components/expenses/ExpenseTypeSelector";
import InventoryExpenseForm, { InventoryItem } from "../components/expenses/InventoryExpenseForm";
import WagesRentForm from "../components/expenses/WagesRentForm";
import StatusSelector from "../components/expenses/StatusSelector";

import { ExpenseSchema, ExpenseForm, ExpenseErrors } from "../zod/Expenses";

type RawExpenseForm = {
    expenseType: "" | "Inventory" | "Wages" | "Rent";
    selectedInventoryId: string;
    to: string;
    purpose: string;
    totalAmount: string;
    paidAmount: string;
    dueAmount: number;
};

const Expenses = () => {
    const { user } = useAuth() as { user: { email?: string; role?: string } | null };

    const [formData, setFormData] = useState<RawExpenseForm>({
        expenseType: "",
        selectedInventoryId: "",
        to: "",
        purpose: "",
        totalAmount: "",
        paidAmount: "",
        dueAmount: 0,
    });

    const [inventoryList, setInventoryList] = useState<InventoryItem[]>([]);
    const [selectedInventory, setSelectedInventory] = useState<InventoryItem | null>(null);
    const [status, setStatus] = useState<"Paid" | "Unpaid">("Paid");
    const [errors, setErrors] = useState<ExpenseErrors>({});
    const [submitting, setSubmitting] = useState(false);

    // Fetch inventory items
    useEffect(() => {
        const fetchInventory = async () => {
            try {
                const snapshot = await getDocs(collection(db, "inventory"));
                const data: InventoryItem[] = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...(doc.data() as Omit<InventoryItem, "id">),
                }));
                setInventoryList(data);
            } catch (error) {
                console.error("Error fetching inventory:", error);
            }
        };
        fetchInventory();
    }, []);

    // Update selectedInventory based on ID
    useEffect(() => {
        const selected = inventoryList.find((item) => item.id === formData.selectedInventoryId) || null;
        setSelectedInventory(selected);
    }, [formData.selectedInventoryId, inventoryList]);

    // Auto-calculate dueAmount
    useEffect(() => {
        const total = parseFloat(formData.totalAmount) || 0;
        const paid = parseFloat(formData.paidAmount) || 0;
        setFormData((prev) => ({ ...prev, dueAmount: total - paid }));
    }, [formData.totalAmount, formData.paidAmount]);

    // Resets the entire form
    const resetForm = () => {
        setFormData({
            expenseType: "",
            selectedInventoryId: "",
            to: "",
            purpose: "",
            totalAmount: "",
            paidAmount: "",
            dueAmount: 0,
        });
        setSelectedInventory(null);
        setStatus("Paid");
        setErrors({});
    };

    const handleChange = <K extends keyof RawExpenseForm>(field: K, value: RawExpenseForm[K]) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

    const handleSubmit = async () => {
        if (!user) {
            alert("User not authenticated.");
            return;
        }

        const parsed = ExpenseSchema.safeParse(formData);

        if (!parsed.success) {
            const flat = parsed.error.flatten().fieldErrors;

            const formattedErrors: ExpenseErrors = {};

            // Type-safe iteration over keys of the flattened error object
            for (const key of Object.keys(flat) as (keyof ExpenseErrors)[]) {
                const message = flat[key]?.[0];
                if (message) {
                    formattedErrors[key] = message;
                }
            }

            setErrors(formattedErrors);
            return;
        }


        setSubmitting(true);

        const baseData = {
            type: "expense",
            category: formData.expenseType,
            status,
            addedBy: user.email,
            role: user.role || "staff",
            recordedAt: serverTimestamp(),
        };

        let expenseDetails: Record<string, any> = {};

        if (formData.expenseType === "Inventory" && selectedInventory) {
            expenseDetails = {
                "inventory-id": selectedInventory.id,
                "inventory-name": selectedInventory.name,
                "inventory-category": selectedInventory.category,
                "inventory-price": selectedInventory.price,
                "inventory-quantity": selectedInventory.quantity,
                "inventory-unitOfPrice": selectedInventory.unitOfPrice,
                "inventory-addedBy": selectedInventory.addedBy || "",
            };
        } else {
            expenseDetails = {
                to: formData.to.trim(),
                purpose: formData.purpose.trim(),
                totalAmount: Number(formData.totalAmount),
                paidAmount: Number(formData.paidAmount),
                dueAmount: formData.dueAmount,
            };
        }

        try {
            await addDoc(collection(db, "transaction"), {
                ...baseData,
                ...expenseDetails,
            });
            alert("Expense saved successfully.");
            resetForm();
        } catch (err) {
            console.error("Error saving expense:", err);
            alert("Failed to save expense.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 px-4 py-6 relative">
            <div className="absolute top-4 left-4">
                <BackButton />
            </div>

            <div className="flex flex-col items-center justify-center mt-12 space-y-8">
                <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold text-center mb-6">Record Expense</h2>

                    <ExpenseTypeSelector
                        selected={formData.expenseType}
                        onChange={(val) => {
                            if (val === "Inventory" || val === "Wages" || val === "Rent") {
                                resetForm(); // Reset to avoid mixed values
                                setFormData((prev) => ({ ...prev, expenseType: val }));
                            }
                        }}
                        error={errors.expenseType}
                    />

                    {formData.expenseType === "Inventory" && (
                        <InventoryExpenseForm
                            inventoryList={inventoryList}
                            selectedInventoryId={formData.selectedInventoryId}
                            setSelectedInventoryId={(val) => handleChange("selectedInventoryId", val)}
                            selectedInventory={selectedInventory}
                            error={errors.selectedInventoryId}
                        />
                    )}

                    {(formData.expenseType === "Wages" || formData.expenseType === "Rent") && (
                        <WagesRentForm
                            type={formData.expenseType}
                            to={formData.to}
                            setTo={(val) => handleChange("to", val)}
                            purpose={formData.purpose}
                            setPurpose={(val) => handleChange("purpose", val)}
                            totalAmount={formData.totalAmount}
                            setTotalAmount={(val) => handleChange("totalAmount", val)}
                            paidAmount={formData.paidAmount}
                            setPaidAmount={(val) => handleChange("paidAmount", val)}
                            dueAmount={formData.dueAmount}
                            errors={{
                                to: errors.to,
                                purpose: errors.purpose,
                                totalAmount: errors.totalAmount,
                                paidAmount: errors.paidAmount,
                            }}
                        />
                    )}

                    {(formData.expenseType === "Inventory" ||
                        formData.expenseType === "Wages" ||
                        formData.expenseType === "Rent") && (
                            <StatusSelector selected={status} onChange={(val) => setStatus} />
                        )}

                    <Submit disabled={submitting} loading={submitting} onClick={handleSubmit} />
                </div>
            </div>
        </div>
    );
};

export default Expenses;