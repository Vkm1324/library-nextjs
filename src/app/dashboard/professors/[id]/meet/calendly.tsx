"use client";

import React from "react";
import { InlineWidget } from "react-calendly";

const CalendlyCalander = ({ calendlyId,
  prefill

}: {
  calendlyId: string,
  prefill: { name: string , email: string  }
}) => {
    const calendlyUrl = calendlyId ; 
  return (
    <div className="">
      <InlineWidget prefill={prefill} url={"calendlyUrl"} /> 
    </div>
  );
};

export default CalendlyCalander;
