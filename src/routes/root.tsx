import {
  ActionFunction,
  Form,
  LoaderFunction,
  NavLink,
  Outlet,
  useLoaderData,
  useNavigate,
  useNavigation,
  useSubmit,
} from "react-router-dom";
import { ContactType, createContact, getContacts } from "../contacts";
import { useEffect } from "react";

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const q = url.searchParams.get("q") ?? "";
  const contacts = await getContacts(q);
  return { contacts, q };
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const contactInfo = Object.fromEntries(formData);
  const contact = await createContact(contactInfo);

  return { contact };
};

export default function Root() {
  const { contacts, q } = useLoaderData() as {
    contacts: ContactType[];
    q?: string;
  };
  const navigation = useNavigation();
  const navigate = useNavigate();
  const cnLoading = navigation.state === "loading" ? "loading" : "";
  const submit = useSubmit();

  useEffect(() => {
    document.getElementById("q")?.setAttribute("value", q ?? "");
  }, [q]);

  return (
    <>
      <div id="sidebar">
        <h1>React Router Contacts</h1>
        <div>
          <Form id="search-form" role="search">
            <input
              id="q"
              aria-label="Search contacts"
              placeholder="Search"
              type="search"
              name="q"
              defaultValue={q}
              onChange={(e) => submit(e.currentTarget.form)}
            />
            <div id="search-spinner" aria-hidden hidden={true} />
            <div className="sr-only" aria-live="polite"></div>
          </Form>
          <button type="submit" onClick={() => navigate("/contacts/new")}>
            New
          </button>
        </div>
        <nav>
          <ul>
            {contacts.map((contact) => (
              <li key={contact.id}>
                <NavLink
                  to={`/contacts/${contact.id}`}
                  className={({ isActive, isPending }) =>
                    isActive ? "active" : isPending ? "pending" : ""
                  }
                >
                  {contact.first} {contact.last}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div id="detail" className={cnLoading}>
        <Outlet />
      </div>
    </>
  );
}
