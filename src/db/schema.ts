import { defineRelations } from 'drizzle-orm';
import {
  date,
  index,
  integer,
  pgTable,
  real,
  serial,
  timestamp,
  varchar,
  text,
} from 'drizzle-orm/pg-core';

export const exercises = pgTable('exercises', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull().unique(),
  category: varchar('category', { length: 100 }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const workouts = pgTable(
  'workouts',
  {
    id: serial('id').primaryKey(),
    userId: varchar('user_id', { length: 255 }).notNull(),
    name: varchar('name', { length: 255 }),
    date: date('date').notNull().defaultNow(),
    startedAt: timestamp('started_at'),
    completedAt: timestamp('completed_at'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
  },
  (t) => [index('workouts_user_id_idx').on(t.userId)],
);

export const workoutExercises = pgTable('workout_exercises', {
  id: serial('id').primaryKey(),
  workoutId: integer('workout_id')
    .notNull()
    .references(() => workouts.id, { onDelete: 'cascade' }),
  exerciseId: integer('exercise_id')
    .notNull()
    .references(() => exercises.id),
  orderIndex: integer('order_index').notNull(),
  notes: text('notes'),
});

export const sets = pgTable('sets', {
  id: serial('id').primaryKey(),
  workoutExerciseId: integer('workout_exercise_id')
    .notNull()
    .references(() => workoutExercises.id, { onDelete: 'cascade' }),
  setNumber: integer('set_number').notNull(),
  reps: integer('reps'),
  weight: real('weight'),
  weightUnit: varchar('weight_unit', { length: 3 }).notNull().default('kg'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const relations = defineRelations(
  { exercises, workouts, workoutExercises, sets },
  (t) => ({
    workouts: {
      workoutExercises: t.many.workoutExercises(),
    },
    exercises: {
      workoutExercises: t.many.workoutExercises(),
    },
    workoutExercises: {
      workout: t.one.workouts({
        from: t.workoutExercises.workoutId,
        to: t.workouts.id,
      }),
      exercise: t.one.exercises({
        from: t.workoutExercises.exerciseId,
        to: t.exercises.id,
      }),
      sets: t.many.sets(),
    },
    sets: {
      workoutExercise: t.one.workoutExercises({
        from: t.sets.workoutExerciseId,
        to: t.workoutExercises.id,
      }),
    },
  }),
);
