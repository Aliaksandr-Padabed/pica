import React, { useCallback, useEffect, useState } from 'react';
import { TextField, Paper, Dialog } from '@material-ui/core';
import { fromFetch } from 'rxjs/fetch';
import { Thumb } from '../Thumb';
import { switchMapTo } from 'rxjs/operators';
import { timer } from 'rxjs';
import { makeStyles } from '@material-ui/core/styles';

const DEBOUNCE_TIME = 1500;

export interface PicaSearchProps {
  pixabayApiUrl: string;
}

interface Hit {
  id: number;
  pageURL: string;
  type: 'all' | 'photo' | 'illustration' | 'vector';
  previewURL: string;
  webformatURL: string;
  webformatWidth: number;
  webformatHeight: number;
  favorites: number;
  likes: number;
}

interface HitResponse {
  totalHits: number;
  hits: Hit[];
}

export const PicaSearch: React.FC<PicaSearchProps> = (props) => {
  const [query, setQuery] = useState<string>('');
  const [hits, setHits] = useState<Hit[]>([]);
  const [immediate, setImmediate] = useState<string>('');
  const [selected, setSelected] = useState<Hit | null>(null);
  const useStyles = makeStyles({
    container: {
      display: 'flex',
      padding: '10px',
      marginTop: '20px',
      flexWrap: 'wrap',
      height: 'calc(100vh - 130px)',
      overflow: 'auto',
    },
    preview: {
      padding: '20px',
      cursor: 'pointer',
      objectFit: 'contain',
    },
  });
  const classes = useStyles();
  const getData = useCallback(
    (queryString: string, delay = 0) => {
      if (!queryString.trim()) {
        return;
      }
      const subscription = timer(delay)
        .pipe(
          switchMapTo(
            fromFetch<HitResponse>(`${props.pixabayApiUrl}&q=${queryString}`, {
              headers: {
                accept: 'application/json',
              },
              selector: (response) => response.json(),
            })
          )
        )
        .subscribe((data) => {
          setHits(data.hits);
        });
      return () => subscription.unsubscribe();
    },
    [props.pixabayApiUrl]
  );

  useEffect(() => {
    if (query.length < 3) {
      return;
    }
    return getData(query, DEBOUNCE_TIME);
  }, [query, getData]);

  useEffect(() => {
    return getData(immediate, 0);
  }, [immediate, getData]);

  return (
    <>
      <TextField
        id="outlined-basic"
        label="Outlined"
        variant="outlined"
        onChange={(event) => setQuery(event.target.value)}
        onKeyPress={handleKeyPress}
      />
      <Paper className={classes.container}>
        {hits.length
          ? hits.map((hit) => {
              return (
                <Thumb
                  key={hit.id}
                  url={hit.previewURL}
                  height={200}
                  width={200}
                  likes={hit.likes}
                  favorites={hit.favorites}
                  onClick={() => handleThumbClick(hit)}
                />
              );
            })
          : 'No items to show.'}
      </Paper>
      <Dialog open={Boolean(selected)} onClose={() => setSelected(null)}>
        <img
          className={classes.preview}
          src={selected?.webformatURL}
          alt=""
          onClick={() => setSelected(null)}
        />
      </Dialog>
    </>
  );

  function handleKeyPress(event: React.KeyboardEvent<HTMLDivElement>): void {
    if (event.key === 'Enter') {
      setImmediate((event.target as HTMLInputElement).value);
    }
  }

  function handleThumbClick(hit: Hit): void {
    setSelected(hit);
  }
};
