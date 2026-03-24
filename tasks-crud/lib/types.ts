export type ActionState = {
  success: boolean;
  message: string;
  errors?: {
    id?: string[];
    title?: string[];
    description?: string[];
  };
};

export type TaskFormValues = {
  title: string;
  description?: string;
};

export type UpdateTaskValues = {
  id: string;
  title: string;
  description?: string;
};
