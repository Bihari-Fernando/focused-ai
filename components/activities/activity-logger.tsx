import { useState } from "react";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";

const activityTypes = [
    { id: "breathing", name: "Guided Breathing" },
    { id: "focus-training", name: "Focus Training Game" },
    { id: "stress-reset", name: "Stress Reset Session" },
    { id: "confidence-builder", name: "Confidence Builder" },
    { id: "mindfulness", name: "Mindfulness Practice" },
    { id: "gratitude", name: "Gratitude Reflection" },
];

interface ActivityLoggerProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function ActivityLogger({
    open,
    onOpenChange,
}: ActivityLoggerProps) {
    const [type, setType] = useState("");
    const [name, setName] = useState("");
    const [duration, setDuration] = useState("");
    const [description, setDescription] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            setIsLoading(true);

            const token = localStorage.getItem("token");

            const response = await fetch(
                "http://localhost:3001/api/activity",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        type,
                        name,
                        duration: Number(duration),
                        description,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to save activity");
            }

            console.log(data);

            // Reset form
            setType("");
            setName("");
            setDuration("");
            setDescription("");

            alert("Activity logged successfully!");

            // Close dialog
            onOpenChange(false);
        } catch (error) {
            console.error(error);
            alert("Failed to save activity");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Log Activity</DialogTitle>

                    <DialogDescription>
                        Record your wellness activity
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Activity Type */}
                    <div className="space-y-2">
                        <Label>Activity Type</Label>

                        <Select value={type} onValueChange={setType}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select activity type" />
                            </SelectTrigger>

                            <SelectContent>
                                {activityTypes.map((activity) => (
                                    <SelectItem
                                        key={activity.id}
                                        value={activity.id}
                                    >
                                        {activity.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Name */}
                    <div className="space-y-2">
                        <Label>Name</Label>

                        <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Breathing Session, Focus Game, etc."
                            required
                        />
                    </div>

                    {/* Duration */}
                    <div className="space-y-2">
                        <Label>Duration (minutes)</Label>

                        <Input
                            type="number"
                            value={duration}
                            onChange={(e) => setDuration(e.target.value)}
                            placeholder="15"
                            min="1"
                        />
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <Label>Description (optional)</Label>

                        <Input
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="How did it go?"
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-2 pt-2">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => onOpenChange(false)}
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>

                        <Button
                            type="submit"
                            disabled={isLoading}
                        >
                            {isLoading ? "Saving..." : "Save Activity"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}