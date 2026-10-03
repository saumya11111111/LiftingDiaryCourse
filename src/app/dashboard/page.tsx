"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon } from "lucide-react";
import { UserButton } from "@clerk/nextjs";

type Set = {
  reps: number;
  weight: number;
};

type Exercise = {
  name: string;
  sets: Set[];
};

type Workout = {
  id: string;
  name: string;
  exercises: Exercise[];
};

const MOCK_WORKOUTS: Workout[] = [
  {
    id: "1",
    name: "Upper Body",
    exercises: [
      { name: "Bench Press", sets: [{ reps: 5, weight: 80 }, { reps: 5, weight: 85 }, { reps: 5, weight: 85 }] },
      { name: "Overhead Press", sets: [{ reps: 8, weight: 50 }, { reps: 8, weight: 50 }] },
      { name: "Pull-ups", sets: [{ reps: 6, weight: 0 }, { reps: 5, weight: 0 }] },
    ],
  },
  {
    id: "2",
    name: "Core",
    exercises: [
      { name: "Plank", sets: [{ reps: 1, weight: 0 }, { reps: 1, weight: 0 }] },
      { name: "Ab Wheel", sets: [{ reps: 10, weight: 0 }, { reps: 10, weight: 0 }] },
    ],
  },
];

export default function DashboardPage() {
  const [date, setDate] = useState<Date>(new Date());

  const workouts = MOCK_WORKOUTS;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans flex flex-col">
      <header className="w-full flex justify-between items-center px-8 py-4 bg-white dark:bg-black border-b border-black/[.08] dark:border-white/[.08]">
        <span className="text-sm font-semibold tracking-tight">LiftingCourseDiary</span>
        <UserButton />
      </header>

      <div className="flex flex-1 pt-10 px-6 pb-6 gap-6 max-w-5xl mx-auto w-full">

        {/* Sidebar — calendar */}
        <aside className="w-fit shrink-0">
          <Card>
            <CardContent className="p-3">
              <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Select date</p>
              <Calendar
                mode="single"
                selected={date}
                onSelect={(d) => { if (d) setDate(d); }}
              />
            </CardContent>
          </Card>
        </aside>

        {/* Main — workout list */}
        <main className="flex-1 space-y-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Workout Log</h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">{format(date, "do MMM yyyy")}</p>
          </div>

          {workouts.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16 text-zinc-500 dark:text-zinc-400">
                <CalendarIcon className="h-8 w-8 mb-3 opacity-40" />
                <p className="text-sm">No workouts logged for {format(date, "do MMM yyyy")}</p>
              </CardContent>
            </Card>
          ) : (
            workouts.map((workout) => (
              <Card key={workout.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-semibold">{workout.name}</CardTitle>
                    <Badge variant="secondary">{workout.exercises.length} exercises</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {workout.exercises.map((exercise, i) => (
                    <div key={i} className="flex items-start justify-between">
                      <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                        {exercise.name}
                      </span>
                      <div className="flex flex-wrap gap-1.5 justify-end max-w-[60%]">
                        {exercise.sets.map((set, j) => (
                          <Badge key={j} variant="outline" className="text-xs tabular-nums">
                            {set.weight > 0 ? `${set.weight}kg × ${set.reps}` : `${set.reps} reps`}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))
          )}
        </main>
      </div>
    </div>
  );
}
