import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";

const quotes = [
  {
    quote: "A reader lives a thousand lives before he dies...",
    book: "A Dance with Dragons",
    author: "George R.R. Martin",
  },
  {
    quote: "It is our choices that show what we truly are...",
    book: "Harry Potter and the Chamber of Secrets",
    author: "J.K. Rowling",
  },
  {
    quote: "Happiness can be found in the darkest of times...",
    book: "Harry Potter and the Prisoner of Azkaban",
    author: "J.K. Rowling",
  },
  {
    quote: "Fairy tales are more than true...",
    book: "Coraline",
    author: "Neil Gaiman",
  },
];

const zoomInOut = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`;

const StyledImageBanner = styled.div`
  position: relative;
  overflow: hidden;
  background-image: linear-gradient(
    to right,
    purple,
    blue
  ); /* Tailwind's bg-gradient-to-r */
  color: white;
  border-radius: 0.5rem; /* Tailwind's rounded-lg */
  padding: 1.5rem; /* Tailwind's p-6 */
  text-align: center;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06); /* Tailwind's shadow-lg */
`;

const QuoteContainer = styled.div`
  position: relative;
  z-index: 10;
  animation: ${zoomInOut} 12s linear infinite;
`;

const QuoteText = styled.h2`
  font-size: 1.5rem; /* Tailwind's text-2xl */
  font-style: italic;
`;

const Author = styled.p`
  margin-top: 0.5rem; /* Tailwind's mt-2 */
  font-size: 1.125rem; /* Tailwind's text-lg */
  font-weight: 600; /* Tailwind's font-semibold */
`;

const Book = styled.p`
  font-size: 0.875rem; /* Tailwind's text-sm */
`;

const ListenButton = styled.button`
  margin-top: 1rem; /* Tailwind's mt-4 */
  padding: 0.5rem 1rem; /* Tailwind's px-4 py-2 */
  background-color: #f59e0b; /* Tailwind's bg-yellow-400 */
  color: black;
  font-weight: 700; /* Tailwind's font-bold */
  border-radius: 0.5rem; /* Tailwind's rounded-lg */
  transition: background-color 0.2s; /* Tailwind's transition */

  &:hover {
    background-color: #f6ad55; /* Tailwind's bg-yellow-500 */
  }
`;

const ImageBanner = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % quotes.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const scrollToBooks = () => {
    const element = document.getElementById("books");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <StyledImageBanner>
      <QuoteContainer>
        <QuoteText>"{quotes[index].quote}"</QuoteText>
        <Author>— {quotes[index].author}</Author>
        <Book>{quotes[index].book}</Book>
        <ListenButton onClick={scrollToBooks}>🎧 Listen Now</ListenButton>
      </QuoteContainer>
    </StyledImageBanner>
  );
};

export default ImageBanner;
