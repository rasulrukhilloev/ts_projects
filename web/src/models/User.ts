import axios, { AxiosResponse } from "axios";

interface UserProps {
  id?: number;
  name?: string;
  age?: number;
}

type Callback = () => void; // Callback that is a function() and returns void

export class User {
  events: { [key: string]: Callback[] } = {};

  constructor(private data: UserProps) {
    this.data = data;
  }

  get(propName: string): number | string {
    return this.data[propName];
  }

  set(update: UserProps): void {
    Object.assign(this.data, update);
  }

  on(eventName: string, callback: Callback): void {
    const handlers = this.events[eventName] || []; //;
    handlers.push(callback);
    this.events[eventName] = handlers;
  } //TODO fix it

  trigger(eventName: string): void {
    const handlers = this.events[eventName];
    if (!handlers || handlers.length === 0) return;

    handlers.forEach((callback) => {
      callback();
    });
  }

  fetch(): void {
    const id = this.get("id");
    axios
      .get(`http://localhost:3000/${id}`)
      .then((response: AxiosResponse): void => {
        this.set(response.data);
      });
  }

  save(): void {
    const id = this.get("id");
    if (this.get("id")) {
      axios.put(`http://localhost:3000/users/${id}`, this.data);
    } else {
      axios.post("http://localhost:3000/users", this.data);
    }
  }
}