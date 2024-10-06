import { ActionFunctionArgs, Form, LoaderFunctionArgs, redirect, useLoaderData } from "react-router-dom";
import { getContact, ContactType, deleteContact } from "../contacts";


export async function loader({ params }: LoaderFunctionArgs) {
  const contact = await getContact(params?.contactId ?? '');
  if (!contact) {
    throw new Response("Not Found", { status: 404 });
  }
  return contact;
}

export async function deleteContactAction({ params }: ActionFunctionArgs) {
  const contact = await getContact(params?.contactId ?? '');
  await deleteContact(contact?.id ?? '');
  return redirect(`/`);
}

export default function Contact() {
  const contact = useLoaderData() as ContactType;

  return (
    <div id="contact">
      <div>
        <img
          key={contact.avatar}
          src={
            `https://robohash.org/${contact.id}.png?size=200x200`
          }
        />
      </div>

      <div>
        <h1>
          {contact.first || contact.last ? (
            <>
              {contact.first} {contact.last}
            </>
          ) : (
            <i>No Name</i>
          )}{" "}
          <Favorite contact={contact} />
        </h1>

        {contact.twitter && (
          <p>
            <a
              target="_blank"
              href={`https://twitter.com/${contact.twitter}`}
            >
              {contact.twitter}
            </a>
          </p>
        )}

        {contact.notes && <p>{contact.notes}</p>}

        <div>
          <Form action="edit">
            <button type="submit">Edit</button>
          </Form>
          <Form
            method="post"
            action="destroy"
            onSubmit={(event) => {
              if (
                !confirm(
                  "Please confirm you want to delete this record."
                )
              ) {
                event.preventDefault();
              }
            }}
          >
            <button type="submit">Delete</button>
          </Form>
        </div>
      </div>
    </div>
  );
}

type FavoriteProps = {
  contact: ContactType;
};

function Favorite({ contact }: FavoriteProps) {
  const favorite = contact.favorite;
  return (
    <Form method="post">
      <button
        name="favorite"
        value={favorite ? "false" : "true"}
        aria-label={
          favorite
            ? "Remove from favorites"
            : "Add to favorites"
        }
      >
        {favorite ? "★" : "☆"}
      </button>
    </Form>
  );
}