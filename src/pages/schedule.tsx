import { ChannelBox, Epg, Layout, useEpg,
  ProgramBox,
  ProgramContent,
  ProgramFlex,
  ProgramStack,
  ProgramTitle,
  ProgramText,
  ProgramImage,
  useProgram,
  ProgramItem } from "planby";
import PageHeader from "../components/layout/PageHeader";
import useSchedule from "../hooks/general/use-schedule";
import useWindowDimensions from "../hooks/general/use-window-dimension";
import { RoomModel } from "../model/entities/room";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const theme = {
  primary: {
    600: 'oklch(var(--b1))',
    900: 'oklch(var(--b2))',
  },
  grey: { 300: '#a0aec0' },
  white: '#fff',
  green: {
    300: '#2C7A7B',
  },
  loader: {
    teal: '#5DDADB',
    purple: '#3437A2',
    pink: '#F78EB6',
    bg: 'oklch(var(--b2))',
  },
  scrollbar: {
    border: '#ffffff',
    thumb: {
      bg: '#e1e1e1',
    },
  },
  gradient: {
    blue: {
      300: 'oklch(var(--n))',
      600: 'oklch(var(--n))',
      900: 'oklch(var(--n))',
    },
  },
  text: {
    grey: {
      300: '#a0aec0',
      500: '#718096',
    },
  },
  timeline: {
    divider: {
      bg: '#718096',
    },
  },
};

interface ChannelItemProps {
  channel: any & RoomModel;
}

const ChannelItem = ({ channel }: ChannelItemProps) => {
  const { position } = channel;
  return (
    <ChannelBox {...position} >
      <div className="p-4 flex flex-col h-24 text-xs w-full justify-center">
        <span onClick={() => console.log(channel)}>{channel.name}</span>
        <span>{channel.floor.name}</span>
      </div>
    </ChannelBox>
  );
};



const Item = ({ program,...rest }: ProgramItem) => {
  const { styles, formatTime, isLive, isMinWidth } = useProgram({ program,...rest });

  const { data } = program;
  const { image, title, since, till } = data;

  const sinceTime = formatTime(since);
  const tillTime = formatTime(till);

  const navigate = useNavigate();

  return (
    <ProgramBox width={styles.width} style={styles.position} onClick={() => navigate('/room-request/' + program.data.id)}>
      <ProgramContent
        width={styles.width}
        isLive={isLive}
      >
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

const ScheduleIndexPage = () => {
  const { width } = useWindowDimensions();
  const [date, setDate] = useState("2024-06-03");

  // const navigate = useNavigate();

  // const [param, setParam] = useState({
  //   page: 1,
  // });

  const { data } = useSchedule({});

  const { getEpgProps, getLayoutProps } = useEpg({
    epg: data?.epgs ?? [],
    channels: data?.channels ?? [],
    startDate: date,
    sidebarWidth: 200,
    width: width - 72 > 1280 ? 1280 : width - 72, //set to current screen width
    theme: theme,
    isLine: true,
  });

  return (
    <section className="flex flex-col h-full flex-1 gap-4 mb-24">
      <PageHeader pageName="Jadwal" />
      <div className="mx-6 h-[75vh] shadow transition-none">
        <Epg {...getEpgProps()}>
          <Layout {...getLayoutProps()} 
            renderChannel={({channel}) => <ChannelItem key={channel.uuid} channel={channel} />}
            renderProgram={({ program,...rest }) => (
              <Item key={program.data.id} program={program} {...rest} />
            )}
          />
        </Epg>
      </div>
    </section>
  );
};

export default ScheduleIndexPage;
