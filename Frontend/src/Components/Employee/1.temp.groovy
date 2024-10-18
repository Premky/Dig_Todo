<div className="row">
                                <div className="font-weight-bold">
                                    ठेगानाः
                                </div>
                                <div className="col-3 mb-3">
                                    <label htmlFor="state">प्रदेश</label>
                                    <Select
                                        name='state' id='state'
                                        className='custom-input'
                                        options={stateOption}
                                        value={stateOption.find(
                                            option => option.value === stateOption.state_id
                                        )}
                                        onChange={changeState}
                                        placeholder='प्रदेश'
                                        required
                                    />
                                </div>
                                <div className="col-3 mb-3">
                                    <label htmlFor="district">जिल्ला</label>
                                    <Select
                                        name='district' id='district'
                                        className='custom-input'
                                        options={districtOption}
                                        value={districtOption.find(
                                            option => option.value === districtOption.state_id
                                        )}
                                        onChange={changeDistrict}
                                        placeholder='जिल्ला'
                                        required
                                    />
                                </div>

                                <div className="col-3 mb-3">
                                    <label htmlFor="city">न.पा./गा.पा.</label>
                                    <Select
                                        name='city' id='city'
                                        className='custom-input'
                                        options={cityOption}
                                        value={cityOption.find(
                                            option => option.value === cityOption.state_id
                                        )}
                                        onChange={changeCity}
                                        placeholder='न.पा./गा.पा.'
                                        required
                                    />
                                </div>
                                <div className="col-1 mb-3 pt-2">
                                    <label htmlFor="ward">वडा नं.</label>
                                    <input type="number" name='ward' placeholder='वडा नं.'
                                        className='custom-input' style={{ width: '55px' }}
                                        value={empAddress.ward}
                                        onChange={(e) => setEmpAddress({ ...empAddress, ward: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="col-1 mb-3 pt-2">
                                    <label htmlFor='is_permanent'>
                                        <input
                                            type="checkbox"
                                            checked={ispermanent}
                                            onChange={handleCheckboxChange}
                                        /> &nbsp;
                                        स्थायी ठेगाना हो/होइन {ispermanent} (?)
                                    </label>
                                </div>

                            </div>