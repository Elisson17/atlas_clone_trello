"use client";

import { useState } from "react";
import { Plus, X, Check } from "lucide-react";
import type { Label } from "@/models/label";
import { useBoard } from "@/contexts/BoardContext";
import {
  addLabelToCardAction,
  removeLabelFromCardAction,
} from "@/actions/label";

interface CardLabelsProps {
  cardId: number;
  currentLabels: Label[];
  onUpdate: () => void;
}

export default function CardLabels({
  cardId,
  currentLabels,
  onUpdate,
}: CardLabelsProps) {
  const { labels } = useBoard();
  const [isOpen, setIsOpen] = useState(false);

  const currentLabelIds = currentLabels.map((l) => l.id);

  async function handleToggleLabel(label: Label) {
    if (currentLabelIds.includes(label.id)) {
      const result = await removeLabelFromCardAction(label.id);
      if (result.success) onUpdate();
    } else {
      const result = await addLabelToCardAction(cardId, label.id);
      if (result.success) onUpdate();
    }
  }

  return (
    <div>
      <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
        Etiquetas
      </h4>
      <div className="flex flex-wrap gap-1.5">
        {currentLabels.map((label) => (
          <span
            key={label.id}
            className="inline-block rounded px-2 py-0.5 text-xs font-medium"
            style={{
              backgroundColor: `${label.color}20`,
              color: label.color,
            }}
          >
            {label.name}
          </span>
        ))}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="h-6 w-6 rounded-full bg-slate-100 dark:bg-[#1e2035] hover:bg-slate-200 dark:hover:bg-[#252540] flex items-center justify-center transition-colors"
        >
          {isOpen ? (
            <X className="h-3 w-3 text-slate-500 dark:text-slate-400" />
          ) : (
            <Plus className="h-3 w-3 text-slate-500 dark:text-slate-400" />
          )}
        </button>
      </div>

      {isOpen && (
        <div className="mt-2 p-3 bg-slate-50 dark:bg-[#111120] rounded-lg border border-slate-200 dark:border-[#1e2035]">
          <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-2">
            Etiquetas do board
          </p>
          <div className="space-y-1">
            {labels.map((label) => (
              <button
                key={label.id}
                onClick={() => handleToggleLabel(label)}
                className="flex items-center gap-2 w-full px-2 py-1.5 rounded hover:bg-slate-100 dark:hover:bg-[#1a1a2e] transition-colors"
              >
                <span
                  className="w-8 h-5 rounded shrink-0"
                  style={{ backgroundColor: label.color }}
                />
                <span className="text-sm text-slate-700 dark:text-slate-300 flex-1 text-left">
                  {label.name}
                </span>
                {currentLabelIds.includes(label.id) && (
                  <Check className="h-4 w-4 text-blue-500 shrink-0" />
                )}
              </button>
            ))}
            {labels.length === 0 && (
              <p className="text-xs text-slate-400 dark:text-slate-500">
                Nenhuma etiqueta criada neste board.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
