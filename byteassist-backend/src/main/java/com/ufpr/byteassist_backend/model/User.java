package com.ufpr.byteassist_backend.model;

import java.util.Collection;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.surrealdb.RecordId;
import com.ufpr.byteassist_backend.validation.ValidationGroups;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Null;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class User implements UserDetails {
    @Null(message = "ID must not be provided in update requests")
    private RecordId id;
    
    @NotBlank(groups = ValidationGroups.Create.class, message = "Email cannot be blank")
    @Email(message = "Email should be valid")
    private String email;

    private boolean isActive = true;
    
    @JsonIgnore
    @NotBlank(groups = ValidationGroups.Create.class, message = "Password cannot be blank when creating a user")
    @Null(groups = ValidationGroups.Update.class, message = "Password must not be provided in update requests")
    private String password;

    @Null(message = "Person ID must be null")
    private RecordId person;
    
    private UserTime time;

    @NotBlank(groups = ValidationGroups.Create.class, message = "Type cannot be blank")
    @Pattern(regexp = "^(Client|Admin|Manager|Employee)$", message = "Type must be either 'Client' or 'Admin'")
    private String role = "Client";
    
    @Override
    public String getUsername() {
        return id.getId().toString();
    }

    @Override
    @JsonIgnore
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return switch (role) {
            case "Admin" -> List.of(
                new SimpleGrantedAuthority("ROLE_ADMIN"),
                new SimpleGrantedAuthority("ROLE_MANAGER"),
                new SimpleGrantedAuthority("ROLE_EMPLOYEE"),
                new SimpleGrantedAuthority("ROLE_CLIENT")
            );
            case "Manager" -> List.of(
                new SimpleGrantedAuthority("ROLE_MANAGER"),
                new SimpleGrantedAuthority("ROLE_EMPLOYEE"),
                new SimpleGrantedAuthority("ROLE_CLIENT")
            );
            case "Employee" -> List.of(
                new SimpleGrantedAuthority("ROLE_EMPLOYEE"),
                new SimpleGrantedAuthority("ROLE_CLIENT")
            );
            case "Client" -> List.of(new SimpleGrantedAuthority("ROLE_CLIENT"));
            default -> throw new IllegalStateException("Unexpected value: " + role);
        };
    }
    
    @Override
    @JsonIgnore
    public boolean isAccountNonExpired() {return true;}
    
    @Override
    @JsonIgnore
    public boolean isAccountNonLocked() {return true;}
    
    @Override
    @JsonIgnore
    public boolean isCredentialsNonExpired() {return true;}
    
    @Override
    @JsonIgnore
    public boolean isEnabled() {return true;}
}