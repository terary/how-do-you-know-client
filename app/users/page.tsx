"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Paper,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  OutlinedInput,
  SelectChangeEvent,
} from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridActionsCellItem,
  GridRenderCellParams,
  GridRowParams,
} from "@mui/x-data-grid";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import { ProtectedRoute } from "../components/auth/ProtectedRoute";
import {
  useGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  type User,
  type CreateUserDto,
  type UpdateUserDto,
} from "@/lib/features/users/usersApiSlice";

const AVAILABLE_ROLES = ["student", "teacher", "admin"];

type DialogMode = "create" | "edit";

interface BaseFormData {
  firstName: string;
  lastName: string;
  email: string;
  roles: string[];
}

interface CreateFormData extends BaseFormData {
  mode: "create";
  username: string;
  password: string;
}

interface EditFormData extends BaseFormData {
  mode: "edit";
}

type FormData = CreateFormData | EditFormData;

interface UserDialogProps {
  open: boolean;
  onClose: () => void;
  user?: User;
  onSubmit: (data: CreateUserDto | UpdateUserDto) => Promise<void>;
}

const UserDialog = ({ open, onClose, user, onSubmit }: UserDialogProps) => {
  const { t } = useTranslation();
  const mode: DialogMode = user ? "edit" : "create";

  const [formData, setFormData] = useState<FormData>(() => {
    const baseData: BaseFormData = user
      ? {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          roles: user.roles,
        }
      : {
          firstName: "",
          lastName: "",
          email: "",
          roles: [],
        };

    return mode === "create"
      ? {
          ...baseData,
          mode: "create",
          username: "",
          password: "",
        }
      : {
          ...baseData,
          mode: "edit",
        };
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleRolesChange = (event: SelectChangeEvent<string[]>) => {
    setFormData((prev) => ({
      ...prev,
      roles: event.target.value as string[],
    }));
  };

  const handleSubmit = () => {
    if (formData.mode === "edit") {
      const updateData: UpdateUserDto = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        roles: formData.roles,
      };
      onSubmit(updateData);
    } else {
      const createData: CreateUserDto = {
        username: formData.username,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        roles: formData.roles,
      };
      onSubmit(createData);
    }
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {mode === "edit" ? t("users.editUser") : t("users.createUser")}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
          {mode === "create" && (
            <>
              <TextField
                name="username"
                label={t("users.username")}
                value={(formData as CreateFormData).username}
                onChange={handleChange}
                fullWidth
                required
              />
              <TextField
                name="password"
                label={t("users.password")}
                type="password"
                value={(formData as CreateFormData).password}
                onChange={handleChange}
                fullWidth
                required
              />
            </>
          )}
          <TextField
            name="firstName"
            label={t("users.firstName")}
            value={formData.firstName}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            name="lastName"
            label={t("users.lastName")}
            value={formData.lastName}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            name="email"
            label={t("users.email")}
            type="email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
            required
          />
          <FormControl fullWidth>
            <InputLabel id="roles-label">{t("users.roles")}</InputLabel>
            <Select
              labelId="roles-label"
              multiple
              value={formData.roles}
              onChange={handleRolesChange}
              input={<OutlinedInput label={t("users.roles")} />}
              renderValue={(selected) => (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} />
                  ))}
                </Box>
              )}
            >
              {AVAILABLE_ROLES.map((role) => (
                <MenuItem key={role} value={role}>
                  {role}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t("singleword.cancel")}</Button>
        <Button onClick={handleSubmit} variant="contained">
          {mode === "edit" ? t("singleword.save") : t("singleword.create")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default function UsersPage() {
  const { t } = useTranslation();
  const { data: users = [], isLoading } = useGetUsersQuery();
  const [createUser] = useCreateUserMutation();
  const [updateUser] = useUpdateUserMutation();
  const [deleteUser] = useDeleteUserMutation();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | undefined>();

  const handleSubmit = async (data: CreateUserDto | UpdateUserDto) => {
    if (selectedUser) {
      await handleUpdate(data as UpdateUserDto);
    } else {
      await handleCreate(data as CreateUserDto);
    }
  };

  const handleCreate = async (data: CreateUserDto) => {
    try {
      await createUser(data).unwrap();
    } catch (error) {
      console.error("Failed to create user:", error);
    }
  };

  const handleUpdate = async (data: UpdateUserDto) => {
    if (!selectedUser) return;
    try {
      await updateUser({
        username: selectedUser.username,
        data,
      }).unwrap();
    } catch (error) {
      console.error("Failed to update user:", error);
    }
  };

  const handleDelete = async (username: string) => {
    try {
      await deleteUser(username).unwrap();
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };

  const columns: GridColDef[] = [
    { field: "username", headerName: t("users.username"), flex: 1 },
    { field: "firstName", headerName: t("users.firstName"), flex: 1 },
    { field: "lastName", headerName: t("users.lastName"), flex: 1 },
    { field: "email", headerName: t("users.email"), flex: 1 },
    {
      field: "roles",
      headerName: t("users.roles"),
      flex: 1,
      renderCell: (params: GridRenderCellParams<User, string[]>) => (
        <Box sx={{ display: "flex", gap: 0.5 }}>
          {params.value?.map((role: string) => (
            <Chip key={role} label={role} size="small" />
          ))}
        </Box>
      ),
    },
    {
      field: "actions",
      type: "actions",
      headerName: t("users.actions"),
      getActions: (params: GridRowParams<User>) => [
        <GridActionsCellItem
          key="edit"
          icon={<EditIcon />}
          label={t("singleword.edit")}
          onClick={() => {
            setSelectedUser(params.row);
            setDialogOpen(true);
          }}
        />,
        <GridActionsCellItem
          key="delete"
          icon={<DeleteIcon />}
          label={t("singleword.delete")}
          onClick={() => handleDelete(params.row.username)}
        />,
      ],
    },
  ];

  return (
    <ProtectedRoute>
      <Box sx={{ height: "100%", width: "100%", p: 3 }}>
        <Paper sx={{ p: 3 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Typography variant="h5" component="h1">
              {t("users.title")}
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => {
                setSelectedUser(undefined);
                setDialogOpen(true);
              }}
            >
              {t("users.createUser")}
            </Button>
          </Box>

          <DataGrid
            rows={users}
            columns={columns}
            getRowId={(row: User) => row.username}
            loading={isLoading}
            autoHeight
            disableRowSelectionOnClick
            initialState={{
              pagination: { paginationModel: { pageSize: 10 } },
            }}
            pageSizeOptions={[10, 25, 50]}
          />
        </Paper>

        <UserDialog
          open={dialogOpen}
          onClose={() => {
            setDialogOpen(false);
            setSelectedUser(undefined);
          }}
          user={selectedUser}
          onSubmit={handleSubmit}
        />
      </Box>
    </ProtectedRoute>
  );
}
