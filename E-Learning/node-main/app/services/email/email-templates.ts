import Configurations from "../../../configs";
const { WebsiteUrls } = Configurations!;

export const generateEmailFormat = (
  heading: string,
  primaryDescription: string,
  secondaryDescription?: string,
  btnText?: { text: string; href: string }
) => {
  return `
  <!DOCTYPE html>

<html lang="en" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:v="urn:schemas-microsoft-com:vml">

<head>
	<title></title>
	<meta charset="utf-8" />
	<meta content="width=device-width, initial-scale=1.0" name="viewport" />
	<!--[if mso]><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch><o:AllowPNG/></o:OfficeDocumentSettings></xml><![endif]-->
	<!--[if !mso]><!-->
	<link href="https://fonts.googleapis.com/css?family=Montserrat" rel="stylesheet" type="text/css" />
	<!--<![endif]-->
	<style>
		* {
			box-sizing: border-box;
		}

		th.column {
			padding: 0
		}

		a[x-apple-data-detectors] {
			color: inherit !important;
			text-decoration: inherit !important;
		}

		#MessageViewBody a {
			color: inherit;
			text-decoration: none;
		}

		p {
			line-height: inherit
		}

		@media (max-width:520px) {
			.icons-inner {
				text-align: center;
			}

			.icons-inner td {
				margin: 0 auto;
			}

			.row-content {
				width: 100% !important;
			}

			.stack .column {
				width: 100%;
				display: block;
			}
		}
	</style>
</head>

<body
	style="background-color: transparent; margin: 0; padding: 0; -webkit-text-size-adjust: none; text-size-adjust: none;">
	<table border="0" cellpadding="0" cellspacing="0" class="nl-container" role="presentation"
		style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: transparent;" width="100%">
		<tbody>
			<tr>
				<td>
					<table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-1"
						role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
						<tbody>
							<tr>
								<td>
									<table align="center" border="0" cellpadding="0" cellspacing="0"
										class="row-content stack" role="presentation"
										style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #8d27aa;"
										width="500">
										<tbody>
											<tr>
												<th class="column"
													style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 5px; padding-bottom: 5px;"
													width="100%">
													<table border="0" cellpadding="0" cellspacing="0"
														class="image_block" role="presentation"
														style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;"
														width="100%">
														<tr>
															<td
																style="width:100%;padding-right:0px;padding-left:0px;padding-top:20px;">
																<div align="center" style="line-height:10px"><img
																		alt="logo"
																		src="https://api.noName.ro/public/website/noName-email-logo.png"
																		style="display: block; height: auto; border: 0; width: 150px; max-width: 100%;"
																		title="logo" width="150" /></div>
															</td>
														</tr>
													</table>
												</th>
											</tr>
										</tbody>
									</table>
								</td>
							</tr>
						</tbody>
					</table>
					<table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-2"
						role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
						<tbody>
							<tr>
								<td>
									<table align="center" border="0" cellpadding="0" cellspacing="0"
										class="row-content stack" role="presentation"
										style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #8d27aa;"
										width="500">
										<tbody>
											<tr>
												<th class="column"
													style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 5px; padding-bottom: 5px;"
													width="100%">
													<table border="0" cellpadding="0" cellspacing="0" class="text_block"
														role="presentation"
														style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;"
														width="100%">
														<tr>
															<td style="padding-left:20px;padding-top:20px;">
																<div
																	style="font-family: 'Trebuchet MS', Tahoma, sans-serif">
																	<div
																		style="font-size: 14px; font-family: 'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif; color: #ffffff; line-height: 1.2;">
																		<p
																			style="margin: 0; font-size: 14px; text-align: center;">
																			<strong><span style="font-size:38px;">${heading}</span></strong></p>
																	</div>
																</div>
															</td>
														</tr>
													</table>
													<table border="0" cellpadding="0" cellspacing="0" class="text_block"
														role="presentation"
														style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;"
														width="100%">
														<tr>
															<td style="padding-left:20px;">
																<div
																	style="font-family: 'Trebuchet MS', Tahoma, sans-serif">
																	<div
																		style="font-size: 12px; color: #63c9cb; line-height: 1.2; font-family: 'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif;">
																		<p
																			style="margin: 0; font-size: 12px; mso-line-height-alt: 14.399999999999999px;">
																			 </p>
																	</div>
																</div>
															</td>
														</tr>
													</table>
												</th>
											</tr>
										</tbody>
									</table>
								</td>
							</tr>
						</tbody>
					</table>
					<table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-3"
						role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
						<tbody>
							<tr>
								<td>
									<table align="center" border="0" cellpadding="0" cellspacing="0"
										class="row-content stack" role="presentation"
										style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #8d27aa;"
										width="500">
										<tbody>
											<tr>
												<th class="column"
													style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 5px; padding-bottom: 5px;"
													width="100%">
                          ${
                            secondaryDescription
                              ? `
                          <table border="0" cellpadding="0" cellspacing="0" class="text_block"
                          role="presentation"
                          style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;"
                          width="100%">
                        
                          <tr>
                            <td
                              style="padding-bottom:10px;padding-left:20px;padding-right:20px;padding-top:10px;">
                              <div
                                style="font-family: 'Trebuchet MS', Tahoma, sans-serif">
                                <div
                                  style="font-size: 14px; font-family: 'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif; color: #ffffff; line-height: 1.2;">
                                  <p
                                    style="margin: 0; font-size: 14px; text-align: center;">
                                    <span style="font-size:30px;">${secondaryDescription}</span></p>
                                </div>
                              </div>
                            </td>
                          </tr>
                        </table>`
                              : ""
                          }
													
													<table border="0" cellpadding="0" cellspacing="0" class="text_block"
														role="presentation"
														style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;"
														width="100%">
														<tr>
															<td
																style="padding-bottom:10px;padding-left:20px;padding-right:20px;padding-top:10px;">
																<div
																	style="font-family: 'Trebuchet MS', Tahoma, sans-serif">
																	<div
																		style="font-size: 14px; font-family: 'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif; color: #ffffff; line-height: 2;">
																		<p
																			style="margin: 0; font-size: 14px; text-align: center;">
																		${primaryDescription}
																		</p>
																	</div>
																</div>
															</td>
														</tr>
													</table>
                          ${
                            btnText
                              ? `<table border="0" cellpadding="0" cellspacing="0"
                          class="button_block" role="presentation"
                          style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;"
                          width="100%">
                          <tr>
                            <td
                              style="padding-bottom:10px;padding-left:20px;padding-right:10px;padding-top:10px;text-align:center;">
                              <div align="center">
                                <!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="https://www.example.com/" style="height:44px;width:357px;v-text-anchor:middle;" arcsize="35%" strokeweight="0.75pt" strokecolor="#fefcff" fillcolor="#fefcff"><w:anchorlock/><v:textbox inset="0px,0px,0px,0px"><center style="color:#7008a6; font-family:'Trebuchet MS', Tahoma, sans-serif; font-size:16px"><![endif]--><a
                                  href=${btnText?.href}
                                  style="text-decoration:none;display:inline-block;color:#7008a6;background-color:#fefcff;border-radius:15px;width:auto;border-top:1px solid #fefcff;border-right:1px solid #fefcff;border-bottom:1px solid #fefcff;border-left:1px solid #fefcff;padding-top:5px;padding-bottom:5px;font-family:'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif;text-align:center;mso-border-alt:none;word-break:keep-all;"
                                  target="_blank"><span
                                    style="padding-left:20px;padding-right:20px;font-size:16px;display:inline-block;letter-spacing:normal;"><span
                                      style="font-size: 16px; line-height: 2; word-break: break-word; mso-line-height-alt: 32px;">${btnText?.text}</span></span></a>
                                <!--[if mso]></center></v:textbox></v:roundrect><![endif]-->
                              </div>
                            </td>
                          </tr>
                        </table>`
                              : ""
                          }
													
												</th>
											</tr>
										</tbody>
									</table>
								</td>
							</tr>
						</tbody>
					</table>
					<table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-4"
						role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
						<tbody>
							<tr>
								<td>
									<table align="center" border="0" cellpadding="0" cellspacing="0"
										class="row-content stack" role="presentation"
										style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #8d27aa;"
										width="500">
										<tbody>
											<tr>
												<th class="column"
													style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 5px; padding-bottom: 5px;"
													width="100%">
													<div class="spacer_block" style="height:20px;line-height:20px;"> 
													</div>
												</th>
											</tr>
										</tbody>
									</table>
								</td>
							</tr>
						</tbody>
					</table>
					<table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-5"
						role="presentation"
						style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #7412a9;" width="100%">
						<tbody>
							<tr>
								<td>
									<table align="center" border="0" cellpadding="0" cellspacing="0"
										class="row-content stack" role="presentation"
										style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #8d27aa;"
										width="500">
										<tbody>
											<tr>
												<th class="column"
													style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 5px; padding-bottom: 5px;"
													width="100%">
													<table border="0" cellpadding="0" cellspacing="0"
														class="image_block" role="presentation"
														style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;"
														width="100%">
														<tr>
															<td style="width:100%;padding-right:0px;padding-left:0px;">
																<div align="center" style="line-height:10px"><img
																		alt="logo"
																		src="https://api.noName.ro/public/website/noName-email-logo.png"
																		style="display: block; height: auto; border: 0; width: 425px; max-width: 100%;"
																		title="logo" width="425" /></div>
															</td>
														</tr>
													</table>
													<table border="0" cellpadding="0" cellspacing="0" class="text_block"
														role="presentation"
														style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;"
														width="100%">
														<tr>
															<td
																style="padding-bottom:30px;padding-left:10px;padding-right:10px;padding-top:10px;">
																<div
																	style="font-family: 'Trebuchet MS', Tahoma, sans-serif">
																	<div
																		style="font-size: 12px; font-family: 'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif; color: #393d47; line-height: 1.2;">
																		<p
																			style="margin: 0; font-size: 12px; text-align: center;">
																			<strong><a href=${WebsiteUrls.terms_of_use}
																					rel="noopener"
																					style="text-decoration: underline; color: #ffffff;"
																					target="_blank">Terms of use</a>  |
																				<a href=${WebsiteUrls.privacy_policy}
																					rel="noopener"
																					style="text-decoration: underline; color: #ffffff;"
																					target="_blank">Policy &amp;
																					Privacy</a>  |  <a
																					href=${WebsiteUrls.contact_us}
																					rel="noopener"
																					style="text-decoration: underline; color: #ffffff;"
																					target="_blank">Contact
																					us</a></strong></p>
																	</div>
																</div>
															</td>
														</tr>
													</table>
												</th>
											</tr>
										</tbody>
									</table>
								</td>
							</tr>
						</tbody>
					</table>
					
				</td>
			</tr>
		</tbody>
	</table><!-- End -->
</body>

</html>
  `;
};
