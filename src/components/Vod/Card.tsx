import {
  Card,
  Image,
  Text,
  Tooltip,
  Badge,
  Button,
  Group,
  createStyles,
  Overlay,
  Center,
  Loader,
  Title,
  Progress,
  ThemeIcon,
} from "@mantine/core";
import Link from "next/link";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { useEffect, useState } from "react";
import { IconCircleCheck } from "@tabler/icons";
import getConfig from "next/config";
dayjs.extend(duration);

const useStyles = createStyles((theme) => ({
  card: {
    backgroundColor: "transparent",
  },
  dateBadge: {
    position: "absolute",
    top: "5px",
    right: "5px",
    pointerEvents: "none",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  durationBadge: {
    position: "absolute",
    top: "5px",
    left: "5px",
    pointerEvents: "none",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  processingOverlay: {
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    position: "absolute",
    width: "100%",
    height: "100%",
    top: 0,
    zIndex: 2,
    borderRadius: theme.radius.sm,
  },
  processingContent: {
    margin: 0,
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
  },
  processingText: {
    color: theme.white,
  },
  progressBar: {
    marginTop: "-0.3rem",
  },
  watchedIcon: {
    position: "absolute",
    bottom: "3.8rem",
    right: "0.4rem",
  },
  vodTitle: {
    color:
      theme.colorScheme === "dark"
        ? theme.colors.gray[2]
        : theme.colors.dark[8],
    fontFamily: `Inter, ${theme.fontFamily}`,
    fontWeight: 600,
  },
}));

export const VodCard = ({ vod, playback }: any) => {
  const { publicRuntimeConfig } = getConfig();
  const { classes, cx, theme } = useStyles();
  const [progress, setProgress] = useState(0);
  const [watched, setWatched] = useState(false);

  useEffect(() => {
    if (playback) {
      // Check if vod is in playback array
      const vodInPlayback = playback.find((p: any) => p.vod_id === vod.id);
      if (vodInPlayback) {
        if (vodInPlayback.status == "finished") {
          setWatched(true);
        }
        if (vodInPlayback.time) {
          const progress = (vodInPlayback.time / vod.duration) * 100;
          setProgress(progress);
        }
      }
    }
  }, []);

  return (
    <div>
      {!vod.processing ? (
        <Link href={"/vods/" + vod.id}>
          <Card className={classes.card} p="0" radius={0}>
            <Card.Section>
              <Image
                radius="sm"
                withPlaceholder={true}
                src={`${publicRuntimeConfig.CDN_URL}${vod.web_thumbnail_path}`}
                fit="contain"
                alt={vod.title}
              />
              {progress > 0 && !watched && (
                <Progress
                  className={classes.progressBar}
                  color="red"
                  radius="xs"
                  size="sm"
                  value={progress}
                />
              )}
              {watched && (
                <Tooltip label="Watched">
                  <ThemeIcon className={classes.watchedIcon} color="green">
                    <IconCircleCheck />
                  </ThemeIcon>
                </Tooltip>
              )}
            </Card.Section>

            <Badge py={0} px={5} className={classes.durationBadge} radius="xs">
              <Text color="gray.2">
                {dayjs.duration(vod.duration, "seconds").format("HH:mm:ss")}
              </Text>
            </Badge>
            <Badge py={0} px={5} className={classes.dateBadge} radius="xs">
              <Text color="gray.2">
                {dayjs(vod.streamed_at).format("YYYY/MM/DD")}
              </Text>
            </Badge>

            <Text mt={5} lineClamp={2} weight={500}>
              <Tooltip
                inline
                openDelay={500}
                closeDelay={100}
                multiline
                label={vod.title}
              >
                <Text className={classes.vodTitle}>{vod.title}</Text>
              </Tooltip>
            </Text>
          </Card>
        </Link>
      ) : (
        <Card className={classes.card} p="0" radius={0}>
          <Card.Section>
            <Image
              radius="sm"
              withPlaceholder={true}
              src={`${publicRuntimeConfig.CDN_URL}${vod.web_thumbnail_path}`}
              fit="contain"
              alt={vod.title}
            />
          </Card.Section>
          <div className={classes.processingOverlay}>
            <Center>
              <div className={classes.processingContent}>
                <div>
                  <Center>
                    <Loader color="violet" size="lg" variant="bars" />
                  </Center>
                </div>
                <Text className={classes.processingText} size="xl" weight={700}>
                  ARCHIVING
                </Text>
              </div>
            </Center>
          </div>

          <Badge py={0} px={5} className={classes.durationBadge} radius="xs">
            <Text color="gray.2">
              {dayjs.duration(vod.duration, "seconds").format("HH:mm:ss")}
            </Text>
          </Badge>
          <Badge py={0} px={5} className={classes.dateBadge} radius="xs">
            <Text color="gray.2">
              {dayjs(vod.streamed_at).format("YYYY/MM/DD")}
            </Text>
          </Badge>

          <Text mt={5} lineClamp={2} weight={500}>
            <Tooltip
              inline
              openDelay={500}
              closeDelay={100}
              multiline
              label={vod.title}
            >
              <Text className={classes.vodTitle}>{vod.title}</Text>
            </Tooltip>
          </Text>
        </Card>
      )}
    </div>
  );
};
