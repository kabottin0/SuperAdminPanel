import PropTypes from "prop-types";
import EditRoundedIcon from "@mui/icons-material/EditRounded";

// material
import { styled } from "@mui/material/styles";
import {
  Grid,
  Button,
  Typography,
  LinearProgress,
  Stack,
  Box,
  Rating,
} from "@mui/material";
// utils
import { fShortenNumber } from "src/utils/formatNumber";
import useTranslation from "next-translate/useTranslation";
// ----------------------------------------------------------------------

const RatingStyle = styled(Rating)(({ theme }) => ({
  marginBottom: theme.spacing(1),
}));

const GridStyle = styled(Grid)(({ theme }) => ({
  padding: theme.spacing(3),
  display: "flex",
  alignItems: "center",
  flexDirection: "column",
  "&.border-bottom": {
    borderBottom: `solid 1px ${theme.palette.divider}`,
  },
  [theme.breakpoints.down("md")]: {
    borderBottom: `solid 1px ${theme.palette.divider}`,
  },
}));

// ----------------------------------------------------------------------

ProgressItem.propTypes = {
  star: PropTypes.object,
  total: PropTypes.number,
};

function ProgressItem({ ...props }) {
  const { star, name, total, isLoading } = props;

  return (
    <Stack direction="row" alignItems="center" spacing={1.5} mb={1}>
      <Typography variant="subtitle2">{name}</Typography>
      <LinearProgress
        variant="determinate"
        value={(star / total) * 100}
        sx={{
          mx: 2,
          flexGrow: 1,
          bgcolor: "divider",
        }}
      />
      <Typography
        variant="body2"
        sx={{ color: "text.secondary", minWidth: 64, textAlign: "right" }}
      >
        {fShortenNumber(star)}
      </Typography>
    </Stack>
  );
}

ProductDetailsReviewOverview.propTypes = {
  onOpen: PropTypes.func,
};

export default function ProductDetailsReviewOverview({ ...props }) {
  const { totalRating, onOpen, reviewsSummery, totalReviews } = props;
  const { t } = useTranslation("details");
  console.log(reviewsSummery, "reviewsSummery");
  return (
    <Box
      sx={{
        height: 1,
        borderRight: (theme) => `1px solid ${theme.palette.divider}`,
      }}
    >
      <Grid container>
        <GridStyle item xs={12} className="border-bottom">
          <Typography variant="subtitle1" gutterBottom>
            {t("average-rating")}
          </Typography>
          <Typography variant="h2" gutterBottom sx={{ color: "error.main" }}>
            {totalReviews === 0 ? 0 : totalRating?.toFixed(1)}
          </Typography>
          <RatingStyle readOnly value={totalRating} precision={0.1} />
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            ({fShortenNumber(totalReviews)}
            &nbsp; {t(totalReviews > 1 ? "reviews" : "review")})
          </Typography>
        </GridStyle>

        <GridStyle item xs={12} className={"border-bottom"}>
          <Stack sx={{ width: 1 }} flexDirection="column-reverse">
            {Array.from(new Array(5)).map((rating: any, index) => {
              const match = reviewsSummery.find(
                (v: any) => v._id === index + 1
              );
              console.log(match, "match");
              return (
                <ProgressItem
                  key={Math.random()}
                  star={match?.count || 0}
                  name={index + 1}
                  total={totalReviews}
                />
              );
            })}
          </Stack>
        </GridStyle>

        <GridStyle item xs={12}>
          <Button
            size="large"
            onClick={onOpen}
            variant="outlined"
            startIcon={<EditRoundedIcon />}
          >
            {t("write-a-review")}
          </Button>
        </GridStyle>
      </Grid>
    </Box>
  );
}
