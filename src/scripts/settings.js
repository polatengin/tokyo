function loadSettingsData(_client, webContext){
    const projectId = webContext.project.id;
    const teamId = webContext.team.id;
  
    let counter = 0;
  
    _client.getTeamMembersWithExtendedProperties(projectId, teamId, 100, 0).then((members) => {
      const createRowForTeamMember = (member) => {
        const row = document.createElement("tr");
        row.id = `member-${member.identity.id}`;
  
        const id = document.createElement("td");
        const photo = document.createElement("td");
        const name = document.createElement("td");
  
        id.innerHTML = "<input type='checkbox' checked />";
        id.style.width = "10%";
        photo.innerHTML = "<img src='" + member.identity.imageUrl + "' width='44' height='44' />";
        photo.style.width = "50px";
        name.innerHTML = "<span>" + member.identity.displayName + "</span>";
  
        row.appendChild(id);
        row.appendChild(photo);
        row.appendChild(name);
  
        return row;
      }
      members.forEach((member) => {
        team.appendChild(createRowForTeamMember(member));
      });
    });
  }