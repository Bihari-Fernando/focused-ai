"use client"

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Send,Bot,User,Loader2,Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion,AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";

const glowAnimation = {
    initial: { opacity: 0.5, scale: 1 },
    animate: {
      opacity: [0.5, 1, 0.5],
      scale: [1, 1.05, 1],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
};   

export default function TherapyPage() {
    const [message,setMessage] = useState("");
    const [isTyping,setIsTyping] = useState(false);
    const [messages,setMessages] = useState<any[]>([]);
    const [mounted,setMounted] = useState(false);
    const [isLoading,setIsLoading] = useState(false);
    const [isChatPaused] = useState(false);

    useEffect(() => {
        setMounted(true);
    },[]);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        if(messagesEndRef.current){
            setTimeout(() => {
                messages.current?.
                scrollIntoView({ behaviour:
                    "smooth"
                });
            },100);
        }
    };

    useEffect(() => {
        if(!isTyping){
            scrollToBottom();
        }
    },[messages,isTyping]);

    return (
        <div className="relative max-w-7xl mx-auto px-2">
            <div></div>
        </div>
    )
}