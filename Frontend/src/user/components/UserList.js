import "./UserList.css";
import UserItem from "./UserItem";

function UserList(props) {
  if (props.items.length === 0) {
    return (
      <div className="Center">
        <h2>No Users Found.</h2>
      </div>
    );
  }

  return (
    <ul className="users-list">
      {props.items.map(user => (
        <UserItem
          key={user.id}
          id={user.id}
          image={user.image}
          name={user.name}
          placecount={user.places.length}
        />
      ))}
    </ul>
  );
}
export default UserList;
