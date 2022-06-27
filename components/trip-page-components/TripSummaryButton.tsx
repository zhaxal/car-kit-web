import { Button } from "@mui/material";

type TripSummaryButtonProps = {
  tripId: string;
};

const TripSummaryButton = ({ tripId }: TripSummaryButtonProps) => {


    
  return <Button variant="outlined">Show summary</Button>;
};

export default TripSummaryButton;
