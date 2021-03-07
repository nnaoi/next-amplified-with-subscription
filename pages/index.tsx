import { Amplify, API, graphqlOperation, withSSRContext } from "aws-amplify";
import { GetStaticProps } from "next";
import Head from 'next/head'
import React, { useEffect, useState } from "react";
import { CreateTodoMutationVariables, ListTodosQuery, OnCreateTodoSubscription } from "../src/API";

import CollapsibleGroupItem, { CollapsibleGroupItemProps } from "../src/components/collapsibleGroupItem";
import { createTodo } from "../src/graphql/mutations";
import { listTodos } from "../src/graphql/queries";
import { onCreateTodo } from "../src/graphql/subscriptions";
import styles from '../styles/Home.module.css'


type HomeProps = {
  data: ListTodosQuery;
}

type CreateTodoSubscriptionEvent = {
  value: {
    data: OnCreateTodoSubscription
  }
}

export default function Home({ data }: HomeProps) {
  const initialItems: CollapsibleGroupItemProps[] =
    data.listTodos.items.map((item) => ({
      id: item.id,
      name: item.name,
      description: item.description,
    }));
  const [
    collpsibleGroupItems,
    setItems
  ] = useState<CollapsibleGroupItemProps[]>(initialItems);
  const [input, setInput] = useState("");

  const add = () => {
    const vars: CreateTodoMutationVariables = {
      input: {
        name: input,
        description: input,
      }
    }
    const client = API.graphql(graphqlOperation(
      createTodo, vars))
    if ("then" in client) {
      client.then(response => {
        console.log(response);
      });
    }
  }

  useEffect(() => {
    const client = API.graphql(
      graphqlOperation(onCreateTodo)
    )
    if ("subscribe" in client) {
      client.subscribe({
        next: ({ value: { data } }: CreateTodoSubscriptionEvent) => {
          if (data.onCreateTodo) {
            const todo: CollapsibleGroupItemProps = {
              id: data.onCreateTodo.id,
              name: data.onCreateTodo.name ?? "",
              description: data.onCreateTodo.description ?? "",
            }
            setItems(prev => [...prev, todo])
          }
        }
      })
    }
  }, [])

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div style={{ fontFamily: 'Roboto' }}>
        <form className="m-4 flex">
          <input 
            className="rounded-l-lg p-4 border-t mr-0 border-b border-l text-gray-800 border-gray-200 bg-white" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button 
            className="px-8 rounded-r-lg bg-yellow-400  text-gray-800 font-bold p-4 uppercase border-yellow-500 border-t border-b border-r"
            disabled={!input}
            onClick={add}
          >
            Add
          </button>
        </form>
        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
          Subscription with ISR
        </h2>
        <div className="flex py-5 h-screen md:-mx-4">
          <div className="w-full my-4">
            {collpsibleGroupItems.map((item) => (
              <CollapsibleGroupItem
                key={item.id}
                id={item.id}
                name={item.name}
                description={item.description}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const SSR = withSSRContext()
  const { data } = await SSR.API.graphql({
    query: listTodos
  })
  return {
    props: {
      data: data
    },
    revalidate: 3,
  }
}