import { useQuery } from "@tanstack/react-query";
import { ScheduleService } from "../../services/general/schedule-service";

const useRoomSchedule = () => {
  const { data, status } = useQuery({
    queryKey: ["general/room-schedules"],
    queryFn: () => ScheduleService.getRoomSchedules(),
  });

  return {
    data,
    status,
  };
};

export default useRoomSchedule
