import {
  ActionFunctionArgs,
  Form,
  redirect,
  useLoaderData,
  useNavigate,
} from "react-router-dom";
import { ContactType, updateContact } from "../contacts";

export async function action({ params, request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const contactInfo = Object.fromEntries(formData);
  const contact = await updateContact(params?.contactId ?? "", contactInfo);
  return redirect(`/contacts/${contact.id}`);
}

export default function EditContact() {
  const { contact } = useLoaderData() as { contact: ContactType };
  const navigate = useNavigate();

  return (
    <Form
      method="post"
      id="contact-form"
      onSubmit={() => {}}
      onAbort={() => {
        alert("You have unsaved changes!");
      }}
    >
      <p>
        <span>Name</span>
        <input
          placeholder="First"
          aria-label="First name"
          type="text"
          name="first"
          defaultValue={contact?.first}
        />
        <input
          placeholder="Last"
          aria-label="Last name"
          type="text"
          name="last"
          defaultValue={contact?.last}
        />
      </p>
      <label>
        <span>Twitter</span>
        <input
          type="text"
          name="twitter"
          placeholder="@jack"
          defaultValue={contact?.twitter}
        />
      </label>
      <label>
        <span>Avatar URL</span>
        <input
          placeholder="https://example.com/avatar.jpg"
          aria-label="Avatar URL"
          type="text"
          name="avatar"
          defaultValue={contact?.avatar}
        />
      </label>
      <label>
        <span>Notes</span>
        <textarea name="notes" defaultValue={contact?.notes} rows={6} />
      </label>
      <p>
        <button type="submit">Save</button>
        <button type="button" onClick={() => navigate(-1)}>
          Cancel
        </button>
      </p>
    </Form>
  );
}
