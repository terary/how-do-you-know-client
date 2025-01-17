"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Chip,
  Snackbar,
  Alert,
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
  Clear as ClearIcon,
} from "@mui/icons-material";
import { ProtectedRoute } from "@/lib/features/auth/components/ProtectedRoute";
import {
  useGetFodderPoolsQuery,
  useCreateFodderPoolMutation,
  useDeleteFodderPoolMutation,
  useUpdateItemsMutation,
  type FodderPool,
  type FodderPoolItem,
  type CreateFodderPoolDto,
} from "@/lib/features/fodder-pools/fodderPoolsApiSlice";

interface ItemsDialogProps {
  open: boolean;
  onClose: () => void;
  pool?: FodderPool;
  onSubmit: (items: string[]) => Promise<void>;
}

const ItemsDialog = ({ open, onClose, pool, onSubmit }: ItemsDialogProps) => {
  const { t } = useTranslation();
  const [newItem, setNewItem] = useState("");
  const [items, setItems] = useState<string[]>([]);

  // Reset items when pool changes or dialog opens
  useEffect(() => {
    if (open) {
      setItems(pool?.items.map((item) => item.text) || []);
      setNewItem("");
    }
  }, [pool, open]);

  const handleAddItem = () => {
    if (newItem.trim()) {
      setItems((prev) => [...prev, newItem.trim()]);
      setNewItem("");
    }
  };

  const handleRemoveItem = (item: string) => {
    setItems((prev) => prev.filter((i) => i !== item));
  };

  const handleSubmit = () => {
    onSubmit(items);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{t("fodderPools.manageItems")}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
          <Box sx={{ display: "flex", gap: 1 }}>
            <TextField
              fullWidth
              label={t("fodderPools.newItem")}
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddItem();
                }
              }}
            />
            <Button variant="contained" onClick={handleAddItem}>
              {t("singleword.add")}
            </Button>
          </Box>
          <List>
            {items.map((item, index) => (
              <ListItem
                key={index}
                secondaryAction={
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleRemoveItem(item)}
                  >
                    <ClearIcon />
                  </IconButton>
                }
              >
                <ListItemText primary={item} />
              </ListItem>
            ))}
          </List>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t("singleword.cancel")}</Button>
        <Button onClick={handleSubmit} variant="contained">
          {t("singleword.save")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

interface PoolDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateFodderPoolDto) => Promise<void>;
  initialData?: Partial<CreateFodderPoolDto>;
}

const PoolDialog = ({
  open,
  onClose,
  onSubmit,
  initialData,
}: PoolDialogProps) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<CreateFodderPoolDto>({
    name: initialData?.name || "",
    description: initialData?.description || "",
    items: initialData?.items || [],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {initialData ? t("fodderPools.editPool") : t("fodderPools.createPool")}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
          <TextField
            fullWidth
            label={t("fodderPools.name")}
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            label={t("fodderPools.description")}
            name="description"
            value={formData.description}
            onChange={handleChange}
            multiline
            rows={3}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t("singleword.cancel")}</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!formData.name.trim()}
        >
          {t("singleword.save")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default function FodderPoolsPage() {
  const { t } = useTranslation();
  const { data: pools = [], isLoading } = useGetFodderPoolsQuery();
  const [createFodderPool] = useCreateFodderPoolMutation();
  const [deleteFodderPool] = useDeleteFodderPoolMutation();
  const [updateItems] = useUpdateItemsMutation();

  const [itemsDialogOpen, setItemsDialogOpen] = useState(false);
  const [poolDialogOpen, setPoolDialogOpen] = useState(false);
  const [selectedPool, setSelectedPool] = useState<FodderPool | undefined>();
  const [error, setError] = useState<string | null>(null);

  const handleCreateSubmit = async (data: CreateFodderPoolDto) => {
    try {
      const pool = await createFodderPool(data).unwrap();
      setPoolDialogOpen(false);
      setSelectedPool(pool);
      setItemsDialogOpen(true);
    } catch (error) {
      console.error("Failed to create fodder pool:", error);
      setError("Failed to create fodder pool");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteFodderPool(id).unwrap();
    } catch (error) {
      console.error("Failed to delete fodder pool:", error);
      setError("Failed to delete fodder pool");
    }
  };

  const handleUpdateItems = async (items: string[]) => {
    if (!selectedPool) return;

    try {
      await updateItems({
        id: selectedPool.id,
        items: items.map((item) => item.trim()).filter((item) => item !== ""),
      }).unwrap();
      setItemsDialogOpen(false);
      setSelectedPool(undefined);
    } catch (error) {
      console.error("Failed to update items:", error);
      setError("Failed to update items");
    }
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", flex: 1 },
    { field: "name", headerName: t("fodderPools.name"), flex: 1 },
    { field: "description", headerName: t("fodderPools.description"), flex: 1 },
    {
      field: "items",
      headerName: t("fodderPools.items"),
      flex: 2,
      renderCell: (
        params: GridRenderCellParams<FodderPool, FodderPoolItem[]>
      ) => (
        <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
          {params.value?.map((item) => (
            <Chip key={item.id} label={item.text} size="small" />
          ))}
        </Box>
      ),
    },
    {
      field: "actions",
      type: "actions",
      headerName: t("fodderPools.actions"),
      getActions: (params: GridRowParams<FodderPool>) => [
        <GridActionsCellItem
          key="edit"
          icon={<EditIcon />}
          label={t("singleword.edit")}
          onClick={() => {
            setSelectedPool(params.row);
            setItemsDialogOpen(true);
          }}
        />,
        <GridActionsCellItem
          key="delete"
          icon={<DeleteIcon />}
          label={t("singleword.delete")}
          onClick={() => handleDelete(params.row.id)}
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
              {t("fodderPools.title")}
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setPoolDialogOpen(true)}
            >
              {t("fodderPools.createPool")}
            </Button>
          </Box>

          <DataGrid
            rows={pools}
            columns={columns}
            getRowId={(row) => row.id}
            loading={isLoading}
            autoHeight
            disableRowSelectionOnClick
            initialState={{
              pagination: { paginationModel: { pageSize: 10 } },
            }}
            pageSizeOptions={[10, 25, 50]}
          />
        </Paper>

        <PoolDialog
          open={poolDialogOpen}
          onClose={() => setPoolDialogOpen(false)}
          onSubmit={handleCreateSubmit}
        />

        <ItemsDialog
          open={itemsDialogOpen}
          onClose={() => {
            setItemsDialogOpen(false);
            setSelectedPool(undefined);
          }}
          pool={selectedPool}
          onSubmit={handleUpdateItems}
        />

        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={() => setError(null)}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert onClose={() => setError(null)} severity="error">
            {error}
          </Alert>
        </Snackbar>
      </Box>
    </ProtectedRoute>
  );
}
