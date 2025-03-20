"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

interface SuccessDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
}

export default function SuccessDialog({
  isOpen,
  onClose,
  title = "お問い合わせを受け付けました",
  message = "担当者から数日以内にご連絡いたします。",
}: SuccessDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="flex flex-col items-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle2 className="w-10 h-10 text-green-500" />
          </div>
          <DialogTitle className="text-xl text-center">{title}</DialogTitle>
          <DialogDescription className="text-center pt-2">{message}</DialogDescription>
        </DialogHeader>

        <div className="flex justify-center mt-6">
          <Button onClick={onClose} className="px-8">
            閉じる
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
