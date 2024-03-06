import React from "react";
import { render, screen } from "@testing-library/react";
import renderer from 'react-test-renderer';
import userEvent from '@testing-library/user-event';
import App from "./App";

describe('Snapshot Componente', () => {
  
  // Instantaneas

  it('renders correctly', () => {
    const tree = renderer
    .create(<App />)
    .toJSON();

    expect(tree).toMatchSnapshot();
  })

  test("render componente editor de mobs", async () => {
    render(<App />);
  });

  test("renderiza la lista de items", async () => {
    const { getByRole } = render(<App />);
    expect(getByRole('list')).toBeInTheDocument();
  });
  
  // Acciones Usuario
  
  test("puede add items" , async () => {
    const user = userEvent.setup()
    user.click(screen.getByRole('boton_addLoot'))
    // await 
    expect(screen.getByRole('boton_addLoot')).toBeInTheDocument();
  
  })

  test("puede delete items" , async () => {
    const user = userEvent.setup()
    // await user.click(screen.getByRole('boton_deleteLoot'))
  
    expect(screen.getByRole('boton_deleteLoot')).toBeInTheDocument();
  
  })
})
