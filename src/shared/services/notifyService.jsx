import React from "react";
import toast from "react-hot-toast";

const defaultOptions = {
    duration: 4000,
    position: "top-center",
    style: {
        background: "#333",
        color: "#fff",
        borderRadius: "8px",
    },
};

const success = (message, options = {}) => {
    toast.success(message, { ...defaultOptions, ...options });
}

const error = (message, options = {}) => {
    toast.error(message, { ...defaultOptions, ...options });
}

const info = (message, options = {}) => {
    toast(message, { ...defaultOptions, ...options });
}

export const notifyService = {
    success,
    error,
    info,
};