"use client";

import { useState, useEffect } from "react";
import type { Activity } from "@/models/activity";
import { activityService } from "@/services/activity";
import Avatar from "@/components/ui/Avatar";
import { formatRelative } from "@/utils/date";
import { ACTIVITY_LABELS } from "@/utils/constants";

interface CardActivityProps {
  cardId: number;
}

export default function CardActivity({ cardId }: CardActivityProps) {
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const response = await activityService.list(cardId);
        setActivities(response.data.activities);
      } catch {
        console.error("Failed to load activities");
        /* silently fail */
      }
    }
    load();
  }, [cardId]);

  return (
    <div className="space-y-3">
      {activities.length === 0 ? (
        <p className="text-sm text-slate-400 dark:text-slate-500">
          Nenhuma atividade registrada.
        </p>
      ) : (
        <div className="space-y-3">
          {activities.map((activity) => (
            <div key={activity.id} className="flex gap-3">
              <Avatar
                src={activity.user.avatar_url}
                name={`${activity.user.first_name} ${activity.user.last_name}`}
                size="sm"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-700 dark:text-slate-300">
                  <span className="font-medium text-slate-900 dark:text-slate-100">
                    {activity.user.first_name}
                  </span>{" "}
                  {ACTIVITY_LABELS[activity.action] || activity.action}
                </p>
                <span className="text-xs text-slate-400 dark:text-slate-500">
                  {formatRelative(activity.created_at)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
