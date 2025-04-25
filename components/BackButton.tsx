"use client";
import React from "react";
import { Button } from "./ui/button";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";

function BackButton() {
  const router = useRouter();

  return (
    <Button onClick={() => router.back()} className="button cursor-pointer">
      <X />
    </Button>
  );
}

export default BackButton;
