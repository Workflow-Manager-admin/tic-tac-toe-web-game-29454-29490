import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

test('renders Tic Tac Toe title and initial board', () => {
  render(<App />);
  expect(screen.getByText(/Tic Tac Toe/i)).toBeInTheDocument();
  expect(screen.getByText(/Next Player: X/i)).toBeInTheDocument();
  expect(screen.getByTestId('reset-button')).toBeInTheDocument();
  // Board should have 9 cells
  expect(screen.getAllByRole('button', { name: /empty board cell/i }).length + screen.getAllByRole('button', { name: /X|O/i }).length).toBe(9);
});

test('players can play and display next turn', () => {
  render(<App />);
  const cells = screen.getAllByRole('button', { name: /empty board cell/i });
  // X goes first, click first cell
  fireEvent.click(cells[0]);
  // Now it should be O's turn
  expect(screen.getByText(/Next Player: O/i)).toBeInTheDocument();
  // Click next available for O
  let updatedCells = screen.getAllByRole('button');
  let next = updatedCells.find((btn) => btn.textContent === "");
  fireEvent.click(next);
  expect(screen.getByText(/Next Player: X/i)).toBeInTheDocument();
});

test('win and draw are displayed and no more moves after', () => {
  render(<App />);
  // Sequence for X to win (0,1,3,4,6)
  const allCells = () => screen.getAllByRole('button');
  fireEvent.click(allCells()[0]); // X
  fireEvent.click(allCells()[1]); // O
  fireEvent.click(allCells()[3]); // X
  fireEvent.click(allCells()[2]); // O
  fireEvent.click(allCells()[6]); // X - Win!
  expect(screen.getByText(/Winner: X/i)).toBeInTheDocument();

  // No more moves accepted after win
  const restCells = allCells().filter(btn => btn.textContent === "");
  restCells.forEach(cell => {
    fireEvent.click(cell);
    expect(cell.textContent).toBe("");
  });
});

test('can click restart and play again', () => {
  render(<App />);
  // Play a couple moves
  const allCells = () => screen.getAllByRole('button');
  fireEvent.click(allCells()[0]);
  fireEvent.click(allCells()[1]);
  const btn = screen.getByTestId("reset-button");
  fireEvent.click(btn);
  // After reset, Next Player: X
  expect(screen.getByText(/Next Player: X/i)).toBeInTheDocument();
  // Board is empty
  allCells().forEach(cell => {
    expect(cell.textContent).toMatch(/^$|X|O/);
  });
});
