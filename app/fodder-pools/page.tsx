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
import { ProtectedRoute } from "../components/auth/ProtectedRoute";
import {
  useGetFodderPoolsQuery,
  useCreateFodderPoolMutation,
  useDeleteFodderPoolMutation,
  useUpdateItemsMutation,
  type FodderPool,
  type FodderPoolItem,
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
  const [items, setItems] = useState<string[]>(
    pool?.items.map((item) => item.text) || []
  );

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
    onClose();
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
            {items.map((item) => (
              <ListItem
                key={item}
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

export default function FodderPoolsPage() {
  const { t } = useTranslation();
  const { data: pools = [], isLoading } = useGetFodderPoolsQuery();
  const [createFodderPool] = useCreateFodderPoolMutation();
  const [deleteFodderPool] = useDeleteFodderPoolMutation();
  const [updateItems] = useUpdateItemsMutation();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedPool, setSelectedPool] = useState<FodderPool | undefined>();
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async () => {
    try {
      const pool = await createFodderPool().unwrap();
      setSelectedPool(pool);
      setDialogOpen(true);
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
      setDialogOpen(false);
      setSelectedPool(undefined);
    } catch (error) {
      console.error("Failed to update items:", error);
      setError("Failed to update items");
    }
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", flex: 1 },
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
            setDialogOpen(true);
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
              onClick={handleCreate}
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

        <ItemsDialog
          open={dialogOpen}
          onClose={() => {
            setDialogOpen(false);
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
