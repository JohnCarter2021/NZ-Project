import styled from 'styled-components';

const UserCard = ({ user, filterType, isPrime }) => {
  
  let isHighlighted = false;
  if (filterType === 'Even' && user.id % 2 === 0) {
    isHighlighted = true;
  } else if (filterType === 'Odd' && user.id % 2 !== 0) {
    isHighlighted = true;
  } else if (filterType === 'Prime' && isPrime(user.id)) {
    isHighlighted = true;
  }

  const avatarUrl = `https://api.dicebear.com/7.x/adventurer/svg?seed=${user.username}`;
  
  return (
    <CardWrapper>
      <CardContent>
        <Avatar src={avatarUrl} alt={user.name} />
        <UserName>{user.name}</UserName>
        <UserEmail>{user.email}</UserEmail>
        <Tag>Album 1</Tag>
      </CardContent>
      <CardFooter highlighted={isHighlighted}>
        {isHighlighted ? filterType : <> </>}
      </CardFooter>
    </CardWrapper>
  );
};

const CardWrapper = styled.div`
  background-color: #fff;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  text-align: center;
`;

const CardContent = styled.div`
  padding: 25px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Avatar = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: #e9ecef;
  margin-bottom: 15px;
`;

const UserName = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 5px;
`;

const UserEmail = styled.p`
  font-size: 0.9rem;
  color: #6c757d;
  margin-bottom: 15px;
`;

const Tag = styled.span`
  background-color: #e0f2f1;
  color: #1D7874;
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
`;

const CardFooter = styled.div`
  padding: 10px;
  font-weight: 600;
  transition: background-color 0.3s, color 0.3s;
  background-color: ${props => props.highlighted ? '#1D7874' : 'transparent'};
  color: ${props => props.highlighted ? '#FFFFFF' : 'transparent'};
  min-height: 40px; /* Ensure footer has height even when empty */
`;

export default UserCard;