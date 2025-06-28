import React from "react";
import Icon3 from "../assets/icon3.png";

export default function PopUpForm({ message, type, onClose }) {
  return (
    <>
      <div className="fixed inset-0 bg-gradient-to-br from-transparent to-anaranjadito/50 backdrop-blur-sm z-40" />
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="relative w-80 bg-anaranjadito rounded-xl shadow-lg">
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-negrito hover:text-grisito text-3xl leading-none cursor-pointer">
            ×
          </button>
          <div className="p-6 pt-10 text-center">
            <img
              src={Icon3}
              alt={type === "success" ? "check icon" : "error icon"}
              className="mx-auto w-12 h-12 mb-3"/>
            <p className="text-negrito leading-snug">{message}</p>
          </div>
        </div>
      </div>
    </>
  );
}
