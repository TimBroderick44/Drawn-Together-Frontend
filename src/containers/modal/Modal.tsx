import React from "react";
import { ModalProps } from "../../types/typing";

const Modal: React.FC<ModalProps> = ({ onClose, message }) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
      <div className="flex flex-col bg-gray-200 rounded-md text-2xl p-5 -mt-40">
        {message}
        <button
          onClick={onClose}
          className="bg-red-500 text-white pl-3 pr-3 pt-1 pb-2 mt-5 rounded-md hover:bg-red-600"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Modal;
