import {
  Box,
  Card,
  Button,
  Typography,
  Stack,
  Paper,
  Dialog,
  Slide,
  useMediaQuery,
  Skeleton,
  useTheme,
  Grid
} from "@mui/material";
import useTranslation from "next-translate/useTranslation";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import CustomersProfileForm from "./customersProfileForm";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
import * as api from "src/services";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";


export default function customersProfile() {
  const { t } = useTranslation("customer info");
  const theme = useTheme();
  const [show, setShow] = useState(false)
  const [open, setOpen] = useState(true)
  const { user } = useSelector(({ user }: { user: any }) => user);


  const { data, isLoading: isLoad } = useQuery(
    ["customers", user],
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
  const handleDelete = async () => {
    // setloading(true);
    const data = {
      id: user._id,
    };
    await mutate(data);
    // apicall((prev: any) => ({ ...prev, apicall: !prev.apicall }));
  };
  return (
    <>
      <Card sx={{ p: 3 }}>
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
                              Phone dal DB
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
                        <Button
                          color="error"
                          size="small"
                          startIcon={<DeleteOutlineRoundedIcon />}
                          // onClick={handleClickOpen({
                          //   value: "delete",
                          //   id: customers._id,
                          // })}
                          onClick={handleDelete}
                          sx={{ mr: 1 }}>
                          Delete
                        </Button>
                        <Button
                          size="small"
                          startIcon={<EditRoundedIcon />}
                          onClick={() => { console.log('click edit') }}>
                          Edit
                        </Button>
                      </Box>
                    </Paper>
                  </Grid>
                </Grid>
              </Paper>
            ))}
        </Stack>
      </Card>
      {show && show ? (
        <Dialog
          open={open}>
          <CustomersProfileForm />
        </Dialog>


      ) : null}
    </>
  )
}

