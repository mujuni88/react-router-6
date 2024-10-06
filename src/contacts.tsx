import localforage from "localforage";
import { matchSorter } from "match-sorter";
import sortBy from "sort-by";

export type ContactType = {
  id: string;
  first?: string;
  last?: string;
  avatar?: string;
  twitter?: string;
  notes?: string;
  favorite?: boolean;
  createdAt: number;
};

export async function getContacts(query?: string): Promise<ContactType[]> {
  await fakeNetwork(`getContacts:${query}`);
  let contacts: ContactType[] = await localforage.getItem("contacts") || [];
  if (query) {
    contacts = matchSorter(contacts, query, { keys: ["first", "last"] });
  }
  return contacts.sort(sortBy("last", "createdAt"));
}

export async function createContact(contactInfo: Partial<ContactType>): Promise<ContactType> {
  await fakeNetwork();
  const id = Math.random().toString(36).substring(2, 9);
  const contact: ContactType = {...contactInfo, id, createdAt: Date.now()};
  const contacts: ContactType[] = await getContacts();
  contacts.unshift(contact);
  await set(contacts);
  return contact;
}

export async function getContact(id: string): Promise<ContactType | null> {
  await fakeNetwork(`contact:${id}`);
  const contacts: ContactType[] = await localforage.getItem("contacts") || [];
  const contact = contacts.find(contact => contact.id === id);
  return contact ?? null;
}

export async function updateContact(id: string, updates: Partial<ContactType>): Promise<ContactType> {
  await fakeNetwork();
  const contacts: ContactType[] = await localforage.getItem("contacts") || [];
  const contact = contacts.find(contact => contact.id === id);
  if (!contact) throw new Error(`No contact found for id: ${id}`);
  Object.assign(contact, updates);
  await set(contacts);
  return contact;
}

export async function deleteContact(id: string): Promise<boolean> {
  const contacts: ContactType[] = await localforage.getItem("contacts") || [];
  const index = contacts.findIndex(contact => contact.id === id);
  if (index > -1) {
    contacts.splice(index, 1);
    await set(contacts);
    return true;
  }
  return false;
}

function set(contacts: ContactType[]): Promise<ContactType[]> {
  return localforage.setItem("contacts", contacts);
}

// fake a cache so we don't slow down stuff we've already seen
let fakeCache: Record<string, boolean> = {};

async function fakeNetwork(key?: string): Promise<void> {
  if (!key) {
    fakeCache = {};
  }

  if (key && fakeCache[key]) {
    return;
  }

  if (key) {
    fakeCache[key] = true;
  }
  return new Promise(res => {
    setTimeout(res, Math.random() * 800);
  });
}