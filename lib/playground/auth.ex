defmodule Playground.Auth do
  @moduledoc """
  The Auth context.
  """

  import Ecto.Query, warn: false
  alias Playground.Repo
  alias Playground.Auth.Token, as: Token
  alias Playground.Auth.User

  @doc """
  Returns the list of users.

  ## Examples

      iex> list_users()
      [%User{}, ...]

  """
  def list_users do
    Repo.all(User)
  end

  @doc """
  Gets a single user.

  Raises `Ecto.NoResultsError` if the User does not exist.

  ## Examples

      iex> get_user!(123)
      %User{}

      iex> get_user!(456)
      ** (Ecto.NoResultsError)

  """
  def get_user!(id), do: Repo.get!(User, id)

  @doc """
  Creates a user.

  ## Examples

      iex> create_user(%{field: value})
      {:ok, %User{}}

      iex> create_user(%{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def create_user(attrs \\ %{}) do
    %User{}
    |> User.changeset(attrs)
    |> Repo.insert()
  end

  @doc """
  Updates a user.

  ## Examples

      iex> update_user(user, %{field: new_value})
      {:ok, %User{}}

      iex> update_user(user, %{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def update_user(%User{} = user, attrs) do
    user
    |> User.changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Deletes a user.

  ## Examples

      iex> delete_user(user)
      {:ok, %User{}}

      iex> delete_user(user)
      {:error, %Ecto.Changeset{}}

  """
  def delete_user(%User{} = user) do
    Repo.delete(user)
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking user changes.

  ## Examples

      iex> change_user(user)
      %Ecto.Changeset{data: %User{}}

  """
  def change_user(%User{} = user, attrs \\ %{}) do
    User.changeset(user, attrs)
  end

  def user_attrs_from_oauth(%{info: %{nickname: nickname, email: email, image: image}, provider: :github}) do
    {:ok, %{
      provider: "github",
      username: nickname,
      email: email,
      avatar_url: image
    }}
  end

  def user_attrs_params_from_oauth(_attrs) do
    {:error, "No user params found"}
  end

  def get_or_create_user(%{provider: _, username: _, email: _, avatar_url: _} = attrs) do
    case Repo.get_by(User, email: attrs.email) do
      nil ->
        %User{}
          |> User.changeset(attrs)
          |> Repo.insert()
      user ->
        {:ok, user}
    end
  end

  def get_user_by_token(token) do
    with {:ok, %{user_id: user_id}} <- Token.verify(token),
         user <- Repo.get(User, user_id)
    do
      user
    else
      _ -> nil
    end
  end
end
