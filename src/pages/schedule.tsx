import { format } from "date-fns";
import {
  ChannelBox,
  Epg,
  Layout,
  ProgramBox,
  ProgramContent,
  ProgramFlex,
  ProgramItem,
  ProgramStack,
  ProgramText,
  ProgramTitle,
  useEpg,
  useProgram,
} from "planby";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import InputText from "../components/forms/InputText";
import PageHeader from "../components/layout/PageHeader";
import useSchedule from "../hooks/general/use-schedule";
import useWindowDimensions from "../hooks/general/use-window-dimension";
import { RoomModel } from "../model/entities/room";
import useAuth from "../hooks/general/use-auth-user";
import { USER_ROLE_INT } from "../lib/constants";

const theme = {
  primary: {
    600: "oklch(var(--b1))",
    900: "oklch(var(--b2))",
  },
  grey: { 300: "#a0aec0" },
  white: "#fff",
  green: {
    300: "#2C7A7B",
  },
  loader: {
    teal: "#5DDADB",
    purple: "#3437A2",
    pink: "#F78EB6",
    bg: "oklch(var(--b2))",
  },
  scrollbar: {
    border: "#ffffff",
    thumb: {
      bg: "#e1e1e1",
    },
  },
  gradient: {
    blue: {
      300: "oklch(var(--n))",
      600: "oklch(var(--n))",
      900: "oklch(var(--n))",
    },
  },
  text: {
    grey: {
      300: "#a0aec0",
      500: "#718096",
    },
  },
  timeline: {
    divider: {
      bg: "#718096",
    },
  },
};

interface ChannelItemProps {
  channel: any & RoomModel;
}

const ChannelItem = ({ channel }: ChannelItemProps) => {
  const { position } = channel;
  return (
    <ChannelBox {...position}>
      <div className="p-4 flex flex-col h-24 text-xs w-full justify-center">
        <span>{channel.name}</span>
        <span>{channel.floor.name}</span>
      </div>
    </ChannelBox>
  );
};

const Item = ({ program, ...rest }: ProgramItem) => {
  const { user } = useAuth();
  const { styles, formatTime, isLive } = useProgram({ program, ...rest });

  const { data } = program;
  const { title, since, till } = data;

  const sinceTime = formatTime(since);
  const tillTime = formatTime(till);

  const navigate = useNavigate();
  
  return (
    <ProgramBox
      width={styles.width}
      style={styles.position}
      onClick={() => {
        if (program.data.borrowed_by_user_id !== user?.id && user?.role === USER_ROLE_INT) return;
        return navigate("/room-request/" + program.data.id);
      }}
    >
      <ProgramContent width={styles.width} isLive={isLive}>
        <ProgramFlex>
          <ProgramStack>
            <ProgramTitle>{title}</ProgramTitle>
            <ProgramText>
              {sinceTime} - {tillTime}
            </ProgramText>
          </ProgramStack>
        </ProgramFlex>
      </ProgramContent>
    </ProgramBox>
  );
};

const initializeDate = () => {
  const now = new Date();
  now.setMinutes(0, 0, 0);
  return now;
};

const ScheduleIndexPage = () => {
  const { width } = useWindowDimensions();

  // set new Date to yyyy-mm-dd hh:00:00
  const [date, setDate] = useState(initializeDate());
  const [inputValue, setInputValue] = useState(format(date, "yyyy-MM-dd"));
  const [searchValue, setSearchValue] = useState(format(date, "yyyy-MM-dd HH:mm:ss"));

  const handleChange = (e: any) => {
    const value = e.target.value;
    setInputValue(value);

    // Create a new Date object from the input value
    const newDate = new Date(value);

    // Check if the created date is valid
    if (!isNaN(newDate.getTime())) {
      newDate.setHours(0);
      newDate.setMinutes(0, 0, 0);
      
      setDate(newDate);
    }
  };

  // const navigate = useNavigate();

  // const [param, setParam] = useState({
  //   page: 1,
  // });

  const { data } = useSchedule({start_date: format(searchValue, "yyyy-MM-dd"), end_date: format(searchValue, "yyyy-MM-dd")});

  const { getEpgProps, getLayoutProps } = useEpg({
    epg: data?.epgs ?? [],
    channels: data?.channels ?? [],
    startDate: searchValue,
    sidebarWidth: 200,
    width: width - 72 > 1280 ? 1280 : width - 72, //set to current screen width
    theme: theme,
  });

  return (
    <section className="flex flex-col h-full flex-1 gap-4 mb-24">
      <PageHeader pageName="Jadwal" />
      <div className="mx-6 flex flex-row items-end gap-4">
        <InputText
          type="date"
          label={"Tanggal Booking"}
          value={inputValue}
          onChange={handleChange}
        />
        <button className="btn btn-primary" type="button" onClick={() => setSearchValue(date.toString())}>Search</button>
      </div>
      <div className="mx-6 h-[75vh] shadow transition-none">
        <Epg {...getEpgProps()}>
          <Layout
            {...getLayoutProps()}
            renderChannel={({ channel }) => (
              <ChannelItem key={channel.uuid} channel={channel} />
            )}
            renderProgram={({ program, ...rest }) => (
              <Item key={program.data.id} program={program} {...rest} />
            )}
          />
        </Epg>
      </div>
    </section>
  );
};

export default ScheduleIndexPage;
