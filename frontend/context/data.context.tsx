import React from 'react';
import { useRouter } from 'next/router';

import Toast from '../components/Toast';
import { useUserContext } from './user.context';

import {
  deleteRequest,
  putRequest,
  postRequest,
} from '../services/crud.service';

/**
 * Fourth-level Context provider for all CRUD operations.
 * Creating, Editing, Deleting user's own collections and snippets.
 *
 * @since 2021-04-08
 */

type HandlerType = {
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  description: string;
  setDescription: React.Dispatch<React.SetStateAction<string>>;
  price: number | string;
  setPrice: React.Dispatch<React.SetStateAction<number | string>>;
  id: number | string;
  setId: React.Dispatch<React.SetStateAction<number | string>>;
  categoryId: number | string;
  setCategoryId: React.Dispatch<
    React.SetStateAction<number | string>
  >;
  editing: boolean;
  setEditing: React.Dispatch<React.SetStateAction<boolean>>;
  submitting: boolean;
  setSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
  deleting: boolean;
  setDeleting: React.Dispatch<React.SetStateAction<boolean>>;

  heading: string;
  setHeading: React.Dispatch<React.SetStateAction<string>>;

  handleSubmit: (
    e: React.FormEvent<HTMLFormElement>
  ) => Promise<void>;
  handleDelete: (
    e: React.FormEvent<HTMLFormElement>
  ) => Promise<void>;
  handleCancel: () => void;
  clearValues: () => void;
};

const DataHandler = React.createContext<HandlerType>(undefined!);

export function DataHandlerProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { username, accessToken, userId } = useUserContext();

  const router = useRouter();

  const [title, setTitle] = React.useState<string>('Your Title');
  const [description, setDescription] = React.useState<string>('');
  const [price, setPrice] = React.useState<number | string>(0.0);
  const [categoryId, setCategoryId] =
    React.useState<number | string>(0);

  const [editing, setEditing] = React.useState<boolean>(false);
  const [submitting, setSubmitting] = React.useState<boolean>(false);
  const [deleting, setDeleting] = React.useState<boolean>(false);

  const [id, setId] = React.useState<number | string>('');

  const [heading, setHeading] = React.useState<string>('Add New');

  const [openSuccess, setOpenSuccess] = React.useState(false);
  const [openWarning, setOpenWarning] = React.useState(false);
  const [openError, setOpenError] = React.useState(false);

  const [message, setMessage] = React.useState<string | any>('');

  const onSuccess = (text: string | any) => {
    setMessage(text);
    setOpenSuccess(true);
    setTimeout(() => {
      setOpenSuccess(false);
      setMessage('');
    }, 1750);
  };
  const onWarning = (text: string | any) => {
    setMessage(text);
    setOpenWarning(true);
    setTimeout(() => {
      setOpenWarning(false);
      setMessage('');
    }, 1750);
  };
  const onError = (text: string | any) => {
    setMessage(text);
    setOpenError(true);
    setTimeout(() => {
      setOpenError(false);
      setMessage('');
    }, 1750);
  };

  const handleCancel = () => {
    router.back();
    clearValues();
  };

  const clearValues = () => {
    setId('');
    setHeading('');
    setTitle('');
    setDescription(``);
    setHeading('Add New');
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setSubmitting(true);
    if (!editing) {
      try {
        await postRequest({
          url: `api/listings`,
          accessToken,
          body: {
            title,
            description,
            price,
            category_id: categoryId,
            user_id: userId,
          },
        }).then((response) => {
          if (response.ok) {
            setTimeout(() => {
              onSuccess('Listing Created');
            }, 750);
            setTimeout(() => {
              setSubmitting(false);
              clearValues();

              router.push({ pathname: `/home` });
            }, 1500);
          } else {
            response.json().then((data) => {
              if (data.message) {
                setSubmitting(false);
                onWarning(data.message);
              } else {
                setSubmitting(false);
                onWarning('Add failed');
              }
            });
          }
        });
      } catch (err: any) {
        setSubmitting(false);
        onError(err.message);
      }
    } else {
      try {
        await putRequest({
          url: `api/listing/${id}`,
          accessToken,
          body: {
            title,
            description,
            price,
            category_id: categoryId,
            user_id: userId,
          },
        }).then((response) => {
          if (response.ok) {
            setTimeout(() => {
              onSuccess('Listing updated');
            }, 750);
            setTimeout(() => {
              setSubmitting(false);
              clearValues();

              router.push({ pathname: `/home` });
            }, 1500);
          } else {
            response.json().then((data) => {
              if (data.message) {
                setSubmitting(false);
                onWarning(data.message);
              } else {
                setSubmitting(false);
                onWarning('Update failed');
              }
            });
          }
        });
      } catch (err: any) {
        setSubmitting(false);
        onError(err.message);
      }
    }
  };

  const handleDelete = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setDeleting(true);
    try {
      await deleteRequest({
        url: `api/listing/${id}`,
        accessToken,
      }).then((res) => {
        if (res.ok) {
          setTimeout(() => {
            onSuccess('Listing deleted');
          }, 750);
          setTimeout(() => {
            setDeleting(false);

            router.push({ pathname: `/home` });
          }, 1500);
        }
      });
    } catch (err: any) {
      setDeleting(false);
      onError(err.message);
    }
  };

  return (
    <DataHandler.Provider
      value={{
        title,
        setTitle,
        description,
        setDescription,
        price,
        setPrice,
        id,
        setId,
        categoryId,
        setCategoryId,
        submitting,
        setSubmitting,
        deleting,
        setDeleting,
        editing,
        setEditing,
        heading,
        setHeading,
        clearValues,
        handleDelete,
        handleCancel,
        handleSubmit,
      }}
    >
      {children}
      <Toast
        open={openSuccess}
        setOpen={setOpenSuccess}
        success
        message={message}
      />
      <Toast
        open={openWarning}
        setOpen={setOpenWarning}
        warning
        message={message}
      />
      <Toast
        open={openError}
        setOpen={setOpenError}
        error
        message={message}
      />
    </DataHandler.Provider>
  );
}

export const useDataHandler = () => React.useContext(DataHandler);
