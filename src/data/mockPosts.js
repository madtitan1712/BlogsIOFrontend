export const mockPosts = {
  content: [
    {
      id: 1,
      title: "Getting Started with React and Tailwind CSS",
      content: "<p>React and Tailwind CSS form a powerful combination for building modern web applications. React provides the component-based architecture, while Tailwind offers a utility-first approach to styling.</p><p>In this post, we'll explore how to set up a new project using Vite, React, and Tailwind CSS, and build a simple responsive UI.</p>",
      createdAt: "2025-09-01T12:00:00Z",
      status: "PUBLISHED",
      author: { id: 1, name: "Jane Smith" },
      tags: ["React", "Tailwind CSS", "Frontend"]
    },
    {
      id: 2,
      title: "Advanced TypeScript Features You Should Know",
      content: "<p>TypeScript continues to evolve with each release, introducing powerful features that enhance developer productivity and code quality. This post explores some of the more advanced TypeScript features that every developer should be familiar with.</p><p>From conditional types to template literal types, we'll cover how these features can make your code more type-safe and expressive.</p>",
      createdAt: "2025-09-05T14:30:00Z",
      status: "PUBLISHED",
      author: { id: 2, name: "John Doe" },
      tags: ["TypeScript", "JavaScript", "Programming"]
    },
    {
      id: 3,
      title: "Building Accessible Web Applications",
      content: "<p>Web accessibility is not just a nice-to-have feature—it's essential for ensuring that your applications can be used by everyone, including people with disabilities.</p><p>In this comprehensive guide, we'll cover practical strategies for making your web applications more accessible, from semantic HTML to ARIA attributes and keyboard navigation.</p>",
      createdAt: "2025-09-10T09:15:00Z",
      status: "PUBLISHED",
      author: { id: 3, name: "Maria Rodriguez" },
      tags: ["Accessibility", "Web Development", "HTML"]
    },
    {
      id: 4,
      title: "Introduction to State Management with Redux",
      content: "<p>As your React application grows, managing state becomes more challenging. Redux provides a predictable state container that helps you manage application state in a consistent way.</p><p>This post introduces the core concepts of Redux and shows how to integrate it into a React application with practical examples.</p>",
      createdAt: "2025-09-15T16:45:00Z",
      status: "PUBLISHED",
      author: { id: 1, name: "Jane Smith" },
      tags: ["Redux", "React", "State Management"]
    },
    {
      id: 5,
      title: "Optimizing Performance in React Applications",
      content: "<p>Performance is a critical aspect of user experience. In this post, we'll explore various techniques for optimizing React applications, from code splitting and lazy loading to memoization and virtualization.</p><p>Learn how to identify performance bottlenecks and apply targeted optimizations to make your React applications blazingly fast.</p>",
      createdAt: "2025-09-20T11:20:00Z",
      status: "PUBLISHED",
      author: { id: 4, name: "Alex Chen" },
      tags: ["Performance", "React", "Optimization"]
    }
  ],
  pageable: {
    sort: {
      empty: false,
      sorted: true,
      unsorted: false
    },
    offset: 0,
    pageNumber: 0,
    pageSize: 10,
    paged: true,
    unpaged: false
  },
  totalPages: 3,
  totalElements: 25,
  last: false,
  size: 10,
  number: 0,
  sort: {
    empty: false,
    sorted: true,
    unsorted: false
  },
  numberOfElements: 5,
  first: true,
  empty: false
};