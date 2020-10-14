import React from 'react';
import { Card, CardActionArea, CardMedia, CardContent, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

export interface ThumbProps {
  url: string;
  height: number;
  width: number;
  likes?: number;
  favorites: number;
  onClick: (event: React.MouseEvent) => void;
}
export const Thumb: React.FC<ThumbProps> = (props) => {
  const useStyles = makeStyles({
    root: {
      margin: '15px',
      width: (props) => `${props.width}px`,
      height: (props) => `${props.height}px`,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
    },
    thumb: {
      flex: '1 1 auto',
      minHeight: 0,
      overflow: 'hidden',
    },
    content: {
      paddingTop: 5,
      paddingBottom: 5,
      flex: '0 1 auto',
      '&:last-child': {
        paddingBottom: 5,
      },
    },
  });
  const classes = useStyles(props);
  return (
    <Card className={classes.root}>
      <CardActionArea className={classes.thumb} onClick={(event) => props.onClick(event)}>
        <CardMedia component="img" image={props.url} title="Contemplative Reptile" />
      </CardActionArea>
      <CardContent className={classes.content}>
        <Typography variant="body2" color="textSecondary" component="p">
          likes: {props.likes}
        </Typography>
        <Typography variant="body2" color="textSecondary" component="p">
          favorites: {props.favorites}
        </Typography>
      </CardContent>
    </Card>
  );
};
