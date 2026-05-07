"use client";
import css from "./SearchBox.module.css";

interface SearchBoxProps {
  onChange: (value: string) => void;
}

export default function SearchBox({ onChange }: SearchBoxProps) {
  return (
    <input
      onChange={(e) => onChange(e.target.value)}
      className={css.input}
      type="text"
      placeholder="Search notes"
    />
  );
}
