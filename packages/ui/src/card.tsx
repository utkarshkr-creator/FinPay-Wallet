import React from "react";
export function Card({
  title,
  children,
}: {
  title: string,
  children?: React.ReactNode;
}
): JSX.Element {
  return (
    <div className="border p-6 flex bg-white rounded-xl justify-between flex-col bg-[#ededed]">
      <h1 className="text-xl border-b pb-2">
        {title}
      </h1>
      {children}
    </div>
  );
}
