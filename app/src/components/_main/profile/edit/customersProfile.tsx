import {
  Box,
  Card,
  Button,
  Typography,
  Stack,
  Dialog,
  useMediaQuery,
  Skeleton,
  useTheme,
  Grid,
} from "@mui/material";
//table
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import useTranslation from "next-translate/useTranslation";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import CustomersProfileForm from "./customersProfileForm";
import { useState } from "react";
import { useMutation, useQuery } from "react-query";
import * as api from "src/services";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import AddRoundedIcon from "@mui/icons-material/AddRounded";




export default function customersProfile() {
  const { t } = useTranslation("customer info");
  const theme = useTheme();
  // const [show, setShow] = useState(false)
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const { user } = useSelector(({ user }: { user: any }) => user);
  const [state, setstate] = useState<any>({
    open: false,
    openDialog: "",
    customer: null,
    apicall: false,
    _id: null,
  });
  const [loading, setloading] = useState(false);

  const { data, isLoading: isLoad } = useQuery(
    ["customers", user, state.apicall],
    () => api.getCustomers(user._id)
  );
  const customers = data?.data;
  const { mutate } = useMutation(api.deleteCustomer, {
    onSuccess: (data) => {
      // setloading(false);
      // onClose();
      const { message } = data;
      toast.success(t(message));
    },
  });
  const handleClickOpen = (prop: any) => () => {
    if (typeof prop === "object") {
      if (prop.value === "edit") {
        setstate({
          open: true,
          openDialog: "edit",
          customer: prop.customer,
        });
      } else {
        setstate({
          open: true,
          openDialog: "delete",
          _id: prop.id,
        });
      }
    } else {
      setstate({
        ...state,
        open: true,
        openDialog: prop,
        customer: null,
      });
    }
  };
  const handleClose = () => {
    setstate({ ...state, open: false, openDialog: "", customer: null });
  };
  const handleDelete = async (customerId: any) => {
    setloading(true);
    const data = {
      _id: customerId,
    };
    await mutate(data);
    setstate((prev: any) => ({ ...prev, apicall: !prev.apicall }));
  };
  return (
    <>

      <TableContainer component={Paper}>
        <Button
          onClick={handleClickOpen("new")}
          size="small"
          startIcon={<AddRoundedIcon />}>
          {t("add new customer")}
        </Button>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead style={{ backgroundColor: theme.palette.background.default, color: 'white' }}>
            <TableRow>
              <TableCell align="left">Name</TableCell>
              <TableCell align="left">Business&nbsp;Name</TableCell>
              <TableCell align="left">Email&nbsp;(g)</TableCell>
              <TableCell align="left">options</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {customers?.map((customer: any) => (
              <TableRow
                key={customer._id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell align="left">{customer.customerName}</TableCell>
                <TableCell component="th" scope="row">{customer.businessName}</TableCell>
                <TableCell align="left">{customer.email}</TableCell>
                <TableCell align="left">
                  <>
                    <Button
                      size="small"
                      startIcon={<EditRoundedIcon />}
                      onClick={handleClickOpen({ value: "edit", customer })}>
                      {t("edit")}
                    </Button>
                    <Button
                      color="error"
                      size="small"
                      startIcon={<DeleteOutlineRoundedIcon />}
                      onClick={() => handleDelete(customer?._id)}
                      sx={{ mr: 1 }}>
                      {t("delete")}
                    </Button>
                  </>
                </TableCell>

              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {/* <Card sx={{ p: 3 }}>
        <Button
          onClick={handleClickOpen("new")}
          size="small"
          startIcon={<AddRoundedIcon />}>
          {t("add new customer")}
        </Button>
        <Stack spacing={3} alignItems="flex-start">
          <Typography variant="overline" sx={{ color: "text.secondary" }}>
          </Typography>
          {(isLoad ? Array.from(new Array(4)) : customers)?.map(
            (customer: any, index: number) => (
              <Paper>
                <Grid container spacing={2}>
                  <Grid item xs={10}>
                    <Stack direction='row' justifyContent={'space-between'}>
                      <Paper
                        key={index}
                        sx={{
                          p: 2,
                          width: 1,
                          border: `1px solid ${theme.palette.background.default}`,
                        }}>
                        <Stack direction="row" justifyContent={'space-between'}>
                          <Stack direction="row" spacing={2}>
                            <Typography variant="subtitle1">
                              Nome Cliente:
                            </Typography>
                            <Typography variant="body1" paddingRight={4}>
                              {customer?.customerName}
                            </Typography>
                          </Stack>
                          <Stack direction="row" spacing={2}>
                            <Typography variant="subtitle1">
                              Nome Azienda:
                            </Typography>
                            <Typography variant="body1">
                              {customer?.businessName}
                            </Typography>
                          </Stack>
                        </Stack>
                        <Stack direction="row" justifyContent={'space-between'} mt={2}>
                          <Stack direction="row" spacing={2}>
                            <Typography variant="subtitle1">
                              Address:
                            </Typography>
                            <Typography variant="body1">
                              Adrress cliente dal DB
                            </Typography>
                          </Stack>
                          <Stack direction="row" spacing={2}>
                            <Typography variant="subtitle1">
                              Email:
                            </Typography>
                            <Typography variant="body1">
                              {customer?.email}
                            </Typography>
                          </Stack>
                        </Stack>
                        <Stack direction="row" justifyContent={'space-between'} mt={2}>
                          <Stack direction="row" spacing={2}>
                            <Typography variant="subtitle1">
                              P.IVA:
                            </Typography>
                            <Typography variant="body1">
                              P.IVA dal DB
                            </Typography>
                          </Stack>
                          <Stack direction="row" spacing={2}>
                            <Typography variant="subtitle1">
                              Phone:
                            </Typography>
                            <Typography variant="body1">
                              {customer?.phone}
                            </Typography>
                          </Stack>
                        </Stack>
                      </Paper>
                    </Stack>
                  </Grid>
                  <Grid item xs={2}>
                    <Paper
                      sx={{
                        width: 1,
                        border: `1px solid ${theme.palette.background.default}`,
                      }}>
                      <Box sx={{ mt: 1 }}>
                        {customer ? (
                          <>
                            <Button
                              color="error"
                              size="small"
                              startIcon={<DeleteOutlineRoundedIcon />}
                              onClick={() => handleDelete(customer?._id)}
                              sx={{ mr: 1 }}>
                              {t("delete")}
                            </Button>
                            <Button
                              size="small"
                              startIcon={<EditRoundedIcon />}
                              onClick={handleClickOpen({ value: "edit", customer })}>
                              {t("edit")}
                            </Button>
                          </>
                        ) : (
                          <Stack spacing={2} direction="row" alignItems="center">
                            <Stack spacing={2} direction="row" alignItems="center">
                              <Skeleton variant="text" width={25} height={40} />
                              <Skeleton variant="text" width={70} />
                            </Stack>
                            <Stack spacing={2} direction="row" alignItems="center">
                              <Skeleton variant="text" width={25} height={90} />
                              <Skeleton variant="text" width={70} />
                            </Stack>
                          </Stack>
                        )}
                      </Box>
                    </Paper>
                  </Grid>
                </Grid>
              </Paper>
            ))}

        </Stack>
      </Card> */}
      <Dialog
        fullScreen={fullScreen}
        open={state.open}
        sx={{ "& .MuiDialog-paper": { m: 0, bgcolor: "background.paper" } }}>
        {/* {state.openDialog === "delete" && (
          <>
            <DialogTitle sx={{ display: "flex", alignItems: "flex-start", mb: 1 }}>
              <WarningRoundedIcon sx={{ mr: 1 }} /> Warning
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                Are you sure you want to delete this Customer?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <LoadingButton
                variant="contained"
                loading={loading}
                onClick={() => handleDelete(customer?._id)}>
                Delete
              </LoadingButton>
            </DialogActions>
          </>
        )} */}
        {(state.openDialog === "new" || (state.openDialog === "edit")) && (
          <CustomersProfileForm
            onClose={handleClose}
            apicall={setstate}
            customer={state.customer}
          />
        )}
      </Dialog>
    </>
  )
}

