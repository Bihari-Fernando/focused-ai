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

const activityTypes = [
    { id: "breathing", name: "Guided Breathing" },
    { id: "focus-training", name: "Focus Training Game" },
    { id: "stress-reset", name: "Stress Reset Session" },
    { id: "confidence-builder", name: "Confidence Builder" },
    { id: "mindfulness", name: "Mindfulness Practice" },
    { id: "gratitude", name: "Gratitude Reflection" },
];

interface ActivityLoggerProps {
    open:boolean; 
    onOpenChange: (open: boolean) => void;
}

export function ActivityLogger({open, onOpenChange}
: ActivityLoggerProps) {
    const [type, setType] = useState("");
    const [name,setName] = useState("");
    const [duration,setDuration] = useState("");
    const [description,setDescription] = useState("");
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
        },1000);
    };
}
  
