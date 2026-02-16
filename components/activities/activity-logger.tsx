import { useState } from "react";
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

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

export function ActivityLogger({ open, onOpenChange }
    : ActivityLoggerProps) {
    const [type, setType] = useState("");
    const [name, setName] = useState("");
    const [duration, setDuration] = useState("");
    const [description, setDescription] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        setTimeout(() => {
            console.log({
                type,
                name,
                duration,
                description,
            });

            setType("");
            setName("");
            setDuration("");
            setDescription("");
            setIsLoading(false);

            alert("Activity logged (mock)!");
            onOpenChange(false);
        }, 1000);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Log Activity</DialogTitle>
                    <DialogDescription>Record your wellness activity</DialogDescription>

                </DialogHeader>
                <form action='' onSubmit={handleSubmit}>
                    <div className="space-y-2">
                        <Label>Activity Type</Label>
                        <Select value={type} onValueChange={setType}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select activity type" />
                            </SelectTrigger>
                            <SelectContent>
                                {activityTypes.map((type) => (
                                    <SelectItem key={type.id} value={type.id}>
                                        {type.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Name</Label>
                        <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Breathing Session, Focus Game, Confidence Practice, etc."
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Duration (minutes)</Label>
                        <Input
                            type="number"
                            value={duration}
                            onChange={(e) => setDuration(e.target.value)}
                            placeholder="15"
                        />
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}

