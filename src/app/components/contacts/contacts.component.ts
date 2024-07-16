import { group } from '@angular/animations';
import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { contacts } from 'src/app/utils/mockData';

interface Contacts {
  name: string;
  phone: string;
  email: string;
  id: number;
}

interface contactListItem {
  [key: string]: Contacts[];
}

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css'],
})
export class ContactsComponent implements OnInit {
  // @ViewChild('contactsList') contactsListRef!: ElementRef<HTMLElement>;
  contact!: Contacts[];
  contactList!: contactListItem[];
  searchTerm: string = '';
  filteredContactList!: contactListItem[];
  selectedContact: Contacts | null = null;

  ngOnInit() {
    contacts.sort((a, b) => a.name.localeCompare(b.name));
    this.contact = contacts;
    this.contactList = new Array(26).fill(null).map((_, index) => {
      const char = String.fromCharCode('A'.charCodeAt(0) + index);
      return { [char]: [] };
    });

    this.contact.forEach((item) => {
      const firstChar = item.name.charAt(0).toUpperCase();
      for (let items of this.contactList) {
        if (items[firstChar]) {
          items[firstChar].push(item);
        }
      }
    });

    this.filteredContactList = this.contactList;

    console.log('This is Grouped contact list', this.contactList);
  }

  objectKeys(obj: any): string[] {
    return Object.keys(obj);
  }

  scrollToIndex(key: string) {
    const element = document.getElementById(key);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  filterContacts = () => {
    console.log('clicked1', this.searchTerm);
    if (this.searchTerm) {
      console.log('clicked');
      this.filteredContactList = this.contactList
        .map((group) => {
          const key = this.objectKeys(group)[0];
          const filteredContacts = group[key].filter((contact) =>
            contact.name.toLowerCase().includes(this.searchTerm.toLowerCase())
          );
          return { [key]: filteredContacts };
        })
        .filter((group) => {
          const key = this.objectKeys(group)[0];
          return group[key].length > 0;
        });
    } else {
      this.filteredContactList = this.contactList;
    }
  };
  toggleDetails(contact: Contacts) {
    if (this.selectedContact === contact) {
      this.selectedContact = null; // Hide details if already selected
    } else {
      this.selectedContact = contact; // Show details for the selected contact
    }
  }
}
