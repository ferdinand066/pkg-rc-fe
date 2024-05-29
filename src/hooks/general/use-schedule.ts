import { useQuery } from "@tanstack/react-query";
import { ScheduleService } from "../../services/general/schedule-service";

const useSchedule = (params: object) => {
  const { data, status } = useQuery({
    queryKey: ["general/schedule", params],
    queryFn: () => ScheduleService.getSchedules(params),
  });

  return {
    data,
    status,
  };
};

export default useSchedule
