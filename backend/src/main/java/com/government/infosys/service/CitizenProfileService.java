package com.government.infosys.service;

import com.government.infosys.dto.CreateCitizenProfileRequest;
import com.government.infosys.entity.CitizenProfile;
import com.government.infosys.entity.User;
import com.government.infosys.repository.CitizenProfileRepository;
import com.government.infosys.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CitizenProfileService {

    @Autowired
    private CitizenProfileRepository citizenProfileRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public CitizenProfile createProfile(
            CreateCitizenProfileRequest request) {

        if (request == null) {
            throw new IllegalArgumentException(
                    "Profile request cannot be null"
            );
        }

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "User not found: "
                                        + request.getUserId()
                        )
                );

        /*
         * A user should have only one citizen profile.
         */
        if (citizenProfileRepository
                .findByUserId(request.getUserId())
                .isPresent()) {

            throw new IllegalStateException(
                    "Citizen profile already exists for user: "
                            + request.getUserId()
            );
        }

        CitizenProfile profile = CitizenProfile.builder()
                .user(user)
                .fullName(request.getFullName())
                .dob(request.getDob())
                .gender(request.getGender())
                .aadhaarNo(request.getAadhaarNo())
                .panNo(request.getPanNo())
                .email(request.getEmail())
                .mobile(request.getMobile())
                .addressLine1(request.getAddressLine1())
                .addressLine2(request.getAddressLine2())
                .district(request.getDistrict())
                .taluk(request.getTaluk())
                .village(request.getVillage())
                .bankAccountNo(request.getBankAccountNo())
                .ifscCode(request.getIfscCode())
                .address(request.getAddress())
                .pincode(request.getPincode())
                .state(request.getState())
                .build();

        return citizenProfileRepository.save(profile);
    }

    public CitizenProfile getByUserId(Long userId) {

        return citizenProfileRepository
                .findByUserId(userId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Citizen profile not found for user: "
                                        + userId
                        )
                );
    }

    public CitizenProfile getById(Long id) {

        return citizenProfileRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Citizen profile not found: " + id
                        )
                );
    }
}