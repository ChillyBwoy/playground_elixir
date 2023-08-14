defmodule Playground.Auth.User do
  use Ecto.Schema
  import Ecto.Changeset

  @primary_key {:id, :binary_id, autogenerate: true}
  @foreign_key_type :binary_id
  schema "users" do
    field :token, :string
    field :username, :string
    field :provider, :string
    field :email, :string
    field :avatar_url, :string

    timestamps()
  end

  @doc false
  def changeset(user, attrs) do
    user
    |> cast(attrs, [:email, :username, :avatar_url, :provider, :token])
    |> validate_required([:email, :username, :avatar_url, :provider, :token])
    |> unique_constraint(:username)
    |> unique_constraint(:email)
  end
end
